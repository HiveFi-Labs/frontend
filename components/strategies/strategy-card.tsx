'use client'

import { useState } from 'react'
import { LineChart, Copy, Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export default function StrategyCard({
  strategy,
  isMarketplace = false,
  onSelect,
}) {
  const [isPublic, setIsPublic] = useState(strategy.isPublic || false)

  const handlePublicToggle = (e) => {
    e.stopPropagation()
    setIsPublic(!isPublic)
  }

  const handleAction = (e, action) => {
    e.stopPropagation()
    console.log(`${action} strategy: ${strategy.name}`)
    // Here you would handle the action (edit, delete, etc.)
  }

  return (
    <Card
      className="glass-card overflow-hidden group cursor-pointer transition-all hover:translate-y-[-5px]"
      onClick={() => onSelect(strategy)}
    >
      <CardHeader className="p-4 pb-0 flex flex-row justify-between items-start">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-md ${strategy.type === 'trend' ? 'bg-purple-900/50' : strategy.type === 'mean' ? 'bg-blue-900/50' : 'bg-green-900/50'} flex items-center justify-center`}
            >
              <LineChart
                className={`w-4 h-4 ${strategy.type === 'trend' ? 'text-purple-400' : strategy.type === 'mean' ? 'text-blue-400' : 'text-green-400'}`}
              />
            </div>
            <div>
              <h3 className="font-medium text-white">{strategy.name}</h3>
              <p className="text-xs text-zinc-400">
                {strategy.pair} • {strategy.timeframe}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className={`
              ${
                strategy.status === 'live'
                  ? 'border-green-500 text-green-400 bg-green-900/20'
                  : strategy.status === 'testing'
                    ? 'border-yellow-500 text-yellow-400 bg-yellow-900/20'
                    : 'border-zinc-500 text-zinc-400 bg-zinc-900/20'
              }
            `}
          >
            {strategy.status === 'live'
              ? 'Live'
              : strategy.status === 'testing'
                ? 'Testing'
                : 'Draft'}
          </Badge>
          {!isMarketplace && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-zinc-400 hover:text-zinc-300"
                >
                  <svg
                    width="15"
                    height="3"
                    viewBox="0 0 15 3"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="fill-current"
                  >
                    <path d="M1.5 3C2.32843 3 3 2.32843 3 1.5C3 0.671573 2.32843 0 1.5 0C0.671573 0 0 0.671573 0 1.5C0 2.32843 0.671573 3 1.5 3Z" />
                    <path d="M7.5 3C8.32843 3 9 2.32843 9 1.5C9 0.671573 8.32843 0 7.5 0C6.67157 0 6 0.671573 6 1.5C6 2.32843 6.67157 3 7.5 3Z" />
                    <path d="M13.5 3C14.3284 3 15 2.32843 15 1.5C15 0.671573 14.3284 0 13.5 0C12.6716 0 12 0.671573 12 1.5C12 2.32843 12.6716 3 13.5 3Z" />
                  </svg>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-zinc-900 border-zinc-800"
              >
                <DropdownMenuItem
                  className="text-zinc-300 focus:text-white focus:bg-zinc-800"
                  onClick={(e) => handleAction(e, 'edit')}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Strategy
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-zinc-300 focus:text-white focus:bg-zinc-800"
                  onClick={(e) => handleAction(e, 'duplicate')}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-zinc-800" />
                <DropdownMenuItem
                  className="text-red-400 focus:text-red-300 focus:bg-zinc-800"
                  onClick={(e) => handleAction(e, 'delete')}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="h-[100px] relative mb-4">
          <svg
            className="w-full h-full"
            viewBox="0 0 300 100"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient
                id={`chart-gradient-${strategy.id}`}
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop
                  offset="0%"
                  stopColor={`${strategy.performance.trend === 'up' ? 'rgba(16, 185, 129, 0.5)' : 'rgba(239, 68, 68, 0.5)'}`}
                />
                <stop
                  offset="100%"
                  stopColor={`${strategy.performance.trend === 'up' ? 'rgba(16, 185, 129, 0)' : 'rgba(239, 68, 68, 0)'}`}
                />
              </linearGradient>
              <linearGradient
                id={`line-gradient-${strategy.id}`}
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop
                  offset="0%"
                  stopColor={`${strategy.performance.trend === 'up' ? '#10b981' : '#ef4444'}`}
                />
                <stop
                  offset="100%"
                  stopColor={`${strategy.performance.trend === 'up' ? '#10b981' : '#ef4444'}`}
                />
              </linearGradient>
            </defs>

            {/* Simplified chart path */}
            <path
              d={strategy.performance.chartPath}
              fill="none"
              stroke={`url(#line-gradient-${strategy.id})`}
              strokeWidth="2"
            />

            {/* Area fill */}
            <path
              d={`${strategy.performance.chartPath} L290,90 L10,90 Z`}
              fill={`url(#chart-gradient-${strategy.id})`}
              opacity="0.3"
            />
          </svg>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-xs text-zinc-400">Total Return</p>
            <p
              className={`text-lg font-semibold ${strategy.performance.return.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}
            >
              {strategy.performance.return}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-zinc-400">Sharpe Ratio</p>
            <p className="text-lg font-semibold text-zinc-300">
              {strategy.performance.sharpe}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-zinc-400">Win Rate</p>
            <p className="text-lg font-semibold text-zinc-300">
              {strategy.performance.winRate}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-zinc-400">Max Drawdown</p>
            <p className="text-lg font-semibold text-red-400">
              {strategy.performance.maxDrawdown}
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <div className="text-xs text-zinc-400">
          Last updated: {new Date().toLocaleDateString()}
        </div>

        <div className="text-xs text-zinc-400">
          {strategy.type === 'trend'
            ? 'Trend Following'
            : strategy.type === 'mean'
              ? 'Mean Reversion'
              : strategy.type === 'breakout'
                ? 'Breakout'
                : 'Custom'}{' '}
          Strategy
        </div>
      </CardFooter>
    </Card>
  )
}
