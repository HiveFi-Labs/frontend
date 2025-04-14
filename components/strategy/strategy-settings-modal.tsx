'use client'
import { X, Settings, LineChart, Trash2, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

export default function StrategySettingsModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-zinc-900 rounded-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-zinc-800">
          <h3 className="text-xl font-semibold text-white">
            Advanced Strategy Settings
          </h3>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-zinc-400 hover:text-zinc-300"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-auto p-4">
          <Accordion
            type="multiple"
            className="w-full"
            defaultValue={['indicators', 'risk']}
          >
            <AccordionItem value="indicators" className="border-zinc-800">
              <AccordionTrigger className="text-sm text-zinc-300 hover:text-white py-2">
                Indicators
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 pt-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm text-zinc-400">
                      Active Indicators
                    </label>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-purple-400 hover:text-purple-300 hover:bg-purple-900/20 p-0 flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      Add
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-zinc-800/30 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-purple-900/50 flex items-center justify-center">
                          <LineChart className="w-3 h-3 text-purple-400" />
                        </div>
                        <span className="text-sm text-zinc-300">RSI (14)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-zinc-400 hover:text-zinc-300"
                        >
                          <Settings className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-zinc-400 hover:text-zinc-300"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-2 bg-zinc-800/30 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-blue-900/50 flex items-center justify-center">
                          <LineChart className="w-3 h-3 text-blue-400" />
                        </div>
                        <span className="text-sm text-zinc-300">
                          SMA (10, 30)
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-zinc-400 hover:text-zinc-300"
                        >
                          <Settings className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-zinc-400 hover:text-zinc-300"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="risk" className="border-zinc-800">
              <AccordionTrigger className="text-sm text-zinc-300 hover:text-white py-2">
                Risk Management
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 pt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-zinc-400">Stop Loss (%)</span>
                    <span className="text-xs font-medium text-zinc-300">
                      2.0%
                    </span>
                  </div>
                  <Slider
                    defaultValue={[2]}
                    min={0.5}
                    max={10}
                    step={0.1}
                    className="py-1"
                  />

                  <div className="flex justify-between items-center">
                    <span className="text-xs text-zinc-400">
                      Take Profit (%)
                    </span>
                    <span className="text-xs font-medium text-zinc-300">
                      5.0%
                    </span>
                  </div>
                  <Slider
                    defaultValue={[5]}
                    min={1}
                    max={20}
                    step={0.5}
                    className="py-1"
                  />

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-400">
                      Trailing Stop Loss
                    </span>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-400">
                      Position Sizing (%)
                    </span>
                    <span className="text-xs font-medium text-zinc-300">
                      25%
                    </span>
                  </div>
                  <Slider
                    defaultValue={[25]}
                    min={5}
                    max={100}
                    step={5}
                    className="py-1"
                  />
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="advanced" className="border-zinc-800">
              <AccordionTrigger className="text-sm text-zinc-300 hover:text-white py-2">
                Advanced Settings
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-400">Use Leverage</span>
                    <Switch />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-400">Max Leverage</span>
                    <span className="text-xs font-medium text-zinc-300">
                      3x
                    </span>
                  </div>
                  <Slider
                    defaultValue={[3]}
                    min={1}
                    max={10}
                    step={1}
                    className="py-1"
                    disabled
                  />

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-400">
                      Allow Short Positions
                    </span>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-400">
                      Max Active Positions
                    </span>
                    <span className="text-xs font-medium text-zinc-300">3</span>
                  </div>
                  <Slider
                    defaultValue={[3]}
                    min={1}
                    max={10}
                    step={1}
                    className="py-1"
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <div className="p-4 border-t border-zinc-800 flex justify-end">
          <Button
            variant="outline"
            className="border-zinc-700 text-zinc-300 mr-2"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button className="gradient-button" onClick={onClose}>
            Apply Settings
          </Button>
        </div>
      </div>
    </div>
  )
}
