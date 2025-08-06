import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api'
import { mplBubblegum } from '@metaplex-foundation/mpl-bubblegum'
import { publicKey } from '@metaplex-foundation/umi'
import { z } from 'zod'

// Request validation schema
const metadataRequestSchema = z.object({
  assetId: z.string().min(1, 'Asset ID is required'),
})

// Response types
type MetadataResponse = {
  success: boolean
  metadata?: {
    name: string
    symbol: string
    description?: string
    image?: string
    attributes?: Array<{
      trait_type: string
      value: string | number
    }>
    assetId: string
  }
  error?: string
}

// Network configuration
const IS_MAINNET = process.env.SOLANA_USE_MAINNET === 'true'
const NETWORK = IS_MAINNET ? 'mainnet-beta' : 'devnet'

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json()
    const validationResult = metadataRequestSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json<MetadataResponse>(
        {
          success: false,
          error: validationResult.error.errors[0].message,
        },
        { status: 400 }
      )
    }

    const { assetId } = validationResult.data

    // Setup Umi with DAS API
    const heliusApiKey = process.env.HELIUS_API_KEY
    
    if (!heliusApiKey) {
      console.error('HELIUS_API_KEY not found in environment')
      return NextResponse.json<MetadataResponse>(
        {
          success: false,
          error: 'DAS API configuration error. Please set HELIUS_API_KEY.',
        },
        { status: 500 }
      )
    }
    
    // Use Helius RPC with API key
    const dasRpcUrl = IS_MAINNET 
      ? `https://mainnet.helius-rpc.com/?api-key=${heliusApiKey}`
      : `https://devnet.helius-rpc.com/?api-key=${heliusApiKey}`
    
    console.log('Using Helius DAS RPC for', IS_MAINNET ? 'mainnet' : 'devnet')
    
    const umi = createUmi(dasRpcUrl)
      .use(mplBubblegum())
      .use(dasApi())

    console.log('Fetching metadata for asset:', assetId)

    try {
      // Get asset information using DAS API
      const asset = await umi.rpc.getAsset(publicKey(assetId))
      
      if (!asset) {
        return NextResponse.json<MetadataResponse>(
          {
            success: false,
            error: 'Asset not found',
          },
          { status: 404 }
        )
      }

      console.log('Asset found:', asset)

      // Extract metadata
      const metadata: MetadataResponse['metadata'] = {
        name: asset.content?.metadata?.name || 'Unknown NFT',
        symbol: asset.content?.metadata?.symbol || 'NFT',
        description: asset.content?.metadata?.description,
        assetId: assetId,
      }
      
      // Log the asset structure to debug
      console.log('Asset content:', JSON.stringify(asset.content, null, 2))

      // Get image from JSON metadata
      if (asset.content?.json_uri) {
        try {
          const jsonResponse = await fetch(asset.content.json_uri)
          if (jsonResponse.ok) {
            const jsonData = await jsonResponse.json()
            metadata.image = jsonData.image || jsonData.properties?.files?.[0]?.uri
            metadata.attributes = jsonData.attributes || []
            metadata.description = metadata.description || jsonData.description
          }
        } catch (error) {
          console.error('Error fetching JSON metadata:', error)
        }
      }

      // Check if links is an array (some assets have it as an object)
      if (!metadata.image && asset.content?.links) {
        if (Array.isArray(asset.content.links)) {
          const imageLink = asset.content.links.find(
            link => link.type === 'image' || link.key === 'image'
          )
          if (imageLink) {
            metadata.image = imageLink.uri
          }
        } else if (typeof asset.content.links === 'object') {
          // If links is an object, check for image property
          const links = asset.content.links as Record<string, any>
          if (links.image) {
            metadata.image = links.image
          }
        }
      }

      return NextResponse.json<MetadataResponse>({
        success: true,
        metadata,
      })
      
    } catch (error) {
      console.error('Error fetching asset metadata:', error)
      
      // If DAS API is not available, return error
      if (error instanceof Error && (error.message?.includes('Method not found') || error.message?.includes('getAsset'))) {
        console.log('DAS API method not available')
        return NextResponse.json<MetadataResponse>({
          success: false,
          error: 'DAS API not available. Please check your Helius API key and endpoint.',
        })
      }
      
      return NextResponse.json<MetadataResponse>({
        success: false,
        error: 'Failed to fetch asset metadata',
      })
    }

  } catch (error) {
    console.error('Error in metadata API:', error)
    
    return NextResponse.json<MetadataResponse>(
      {
        success: false,
        error: 'An unexpected error occurred',
      },
      { status: 500 }
    )
  }
}

// GET endpoint for simple access
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const assetId = searchParams.get('assetId')
  
  if (!assetId) {
    return NextResponse.json<MetadataResponse>(
      {
        success: false,
        error: 'Asset ID is required',
      },
      { status: 400 }
    )
  }

  // Forward to POST handler
  return POST(
    new NextRequest(request.url, {
      method: 'POST',
      body: JSON.stringify({ assetId }),
    })
  )
}