#!/bin/bash

echo "🧹 Resetting NFT claim data..."

# Remove the claimed NFTs JSON file
if [ -f "data/claimed-nfts.json" ]; then
  rm -f data/claimed-nfts.json
  echo "✅ Removed claimed-nfts.json"
fi

# Recreate an empty JSON array
echo "[]" > data/claimed-nfts.json
echo "✅ Created fresh claimed-nfts.json"

# Clear localStorage (note: this needs to be done in the browser)
echo ""
echo "⚠️  Note: The old localStorage entries will be automatically cleared when you visit the claim page."
echo "   If you need to manually clear them, run this in the browser console:"
echo "   Object.keys(localStorage).filter(k => k.startsWith('claimed_')).forEach(k => localStorage.removeItem(k))"
echo ""
echo "💡 Tip: To deploy a new collection, change NEXT_PUBLIC_COLLECTION_ID in your .env file"
echo ""

echo "🎉 Server-side claim data has been reset!"
echo "   You can now run 'npm run dev' to start fresh."