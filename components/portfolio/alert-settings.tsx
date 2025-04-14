"use client"

import { useState, useEffect } from "react"
import { Bell, BellOff, Plus, Trash2, AlertTriangle, BarChart4, TrendingDown, DollarSign, Clock } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import portfolioData from "@/services/portfolio-data"
import type { Alert, NotificationPreferences } from "@/types/portfolio"

export default function AlertSettings() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [notificationPreferences, setNotificationPreferences] = useState<NotificationPreferences | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showNewAlertModal, setShowNewAlertModal] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const [alertsData, preferencesData] = await Promise.all([
          portfolioData.getAlerts(),
          portfolioData.getNotificationPreferences(),
        ])
        setAlerts(alertsData)
        setNotificationPreferences(preferencesData)
        setError(null)
      } catch (err) {
        console.error("Failed to fetch alert data", err)
        setError("Failed to load alert settings. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Get icon for alert type - 型安全性を向上
  const getAlertIcon = (type: Alert["type"]) => {
    switch (type) {
      case "performance":
        return <BarChart4 className="w-4 h-4 text-blue-400" />
      case "risk":
        return <TrendingDown className="w-4 h-4 text-red-400" />
      case "strategy":
        return <DollarSign className="w-4 h-4 text-green-400" />
      case "market":
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />
      default:
        return <Bell className="w-4 h-4 text-purple-400" />
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-6">
          <div className="h-8 bg-zinc-800 rounded w-48 animate-pulse" />
          <div className="h-10 w-40 bg-zinc-800 rounded-md animate-pulse" />
        </div>

        <div className="h-64 bg-zinc-800/50 rounded-xl animate-pulse mb-6" />

        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-zinc-800/50 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 bg-red-900/20 border border-red-800 rounded-lg text-red-400">
        <h3 className="text-lg font-semibold mb-2">Error</h3>
        <p>{error}</p>
        <Button
          variant="outline"
          className="mt-4 border-red-800 text-red-400 hover:bg-red-900/20"
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
      </div>
    )
  }

  if (!notificationPreferences) return null

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white">Alert Settings</h2>
        <Button className="gradient-button" onClick={() => setShowNewAlertModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create New Alert
        </Button>
      </div>

      {/* Notification Preferences */}
      <Card className="glass-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-zinc-300">Notification Preferences</CardTitle>
          <CardDescription>Configure how you receive alerts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-white">Email Notifications</h3>
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-400">Enable Email Alerts</span>
                <Switch defaultChecked={notificationPreferences.email.enabled} />
              </div>
              <div className="space-y-2">
                <span className="text-sm text-zinc-400">Email Address</span>
                <Input
                  defaultValue={notificationPreferences.email.address}
                  className="bg-zinc-900/50 border-zinc-700 text-zinc-300 focus-visible:ring-purple-500"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-400">Daily Digest</span>
                <Switch defaultChecked={notificationPreferences.email.dailyDigest} />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium text-white">Push Notifications</h3>
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-400">Enable Push Alerts</span>
                <Switch defaultChecked={notificationPreferences.push.enabled} />
              </div>
              <div className="space-y-2">
                <span className="text-sm text-zinc-400">Device</span>
                <Select defaultValue={notificationPreferences.push.device}>
                  <SelectTrigger className="w-full bg-zinc-900/50 border-zinc-700 text-zinc-300">
                    <SelectValue placeholder="Select device" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-800">
                    <SelectItem value="all">All Devices</SelectItem>
                    <SelectItem value="mobile">Mobile Only</SelectItem>
                    <SelectItem value="desktop">Desktop Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-400">Quiet Hours</span>
                <Switch defaultChecked={notificationPreferences.push.quietHours} />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium text-white">SMS Notifications</h3>
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-400">Enable SMS Alerts</span>
                <Switch defaultChecked={notificationPreferences.sms.enabled} />
              </div>
              <div className="space-y-2">
                <span className="text-sm text-zinc-400">Phone Number</span>
                <Input
                  placeholder="+1 (555) 123-4567"
                  defaultValue={notificationPreferences.sms.phoneNumber}
                  className="bg-zinc-900/50 border-zinc-700 text-zinc-300 focus-visible:ring-purple-500"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-400">Critical Alerts Only</span>
                <Switch defaultChecked={notificationPreferences.sms.criticalOnly} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alert Categories */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="bg-zinc-800/50 border border-zinc-700/50 p-1 mb-4">
          <TabsTrigger
            value="all"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-500 data-[state=active]:text-white"
          >
            All Alerts
          </TabsTrigger>
          <TabsTrigger
            value="performance"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-500 data-[state=active]:text-white"
          >
            Performance
          </TabsTrigger>
          <TabsTrigger
            value="risk"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-500 data-[state=active]:text-white"
          >
            Risk
          </TabsTrigger>
          <TabsTrigger
            value="strategy"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-500 data-[state=active]:text-white"
          >
            Strategy
          </TabsTrigger>
          <TabsTrigger
            value="market"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-500 data-[state=active]:text-white"
          >
            Market
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-0">
          <div className="space-y-4">
            {alerts.map((alert) => (
              <Card key={alert.id} className="glass-card">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-3">
                      <div className="mt-1">{getAlertIcon(alert.type)}</div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-white">{alert.name}</h3>
                          <Badge
                            variant="outline"
                            className={`
                              ${alert.status === "active" ? "border-green-500 text-green-400 bg-green-900/20" : "border-zinc-500 text-zinc-400 bg-zinc-900/20"}
                            `}
                          >
                            {alert.status === "active" ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        <p className="text-sm text-zinc-400 mb-2">{alert.condition}</p>
                        <div className="flex items-center gap-2 text-xs text-zinc-500">
                          <Clock className="w-3 h-3" />
                          <span>
                            {alert.lastTriggered
                              ? `Last triggered: ${new Date(alert.lastTriggered).toLocaleDateString()}`
                              : "Never triggered"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center ${alert.notifications.email ? "bg-purple-900/30 text-purple-400" : "bg-zinc-800/50 text-zinc-500"}`}
                        >
                          <span className="text-xs">E</span>
                        </div>
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center ${alert.notifications.push ? "bg-purple-900/30 text-purple-400" : "bg-zinc-800/50 text-zinc-500"}`}
                        >
                          <span className="text-xs">P</span>
                        </div>
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center ${alert.notifications.sms ? "bg-purple-900/30 text-purple-400" : "bg-zinc-800/50 text-zinc-500"}`}
                        >
                          <span className="text-xs">S</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-zinc-300">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <Switch checked={alert.status === "active"} />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* カテゴリータブのコンテンツをリファクタリング - 共通コンポーネントを抽出 */}
        {["performance", "risk", "strategy", "market"].map((category) => (
          <TabsContent key={category} value={category} className="mt-0">
            <div className="space-y-4">
              {alerts
                .filter((alert) => alert.type === category)
                .map((alert) => (
                  <Card key={alert.id} className="glass-card">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex items-start gap-3">
                          <div className="mt-1">{getAlertIcon(alert.type)}</div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-medium text-white">{alert.name}</h3>
                              <Badge
                                variant="outline"
                                className={`
                                ${alert.status === "active" ? "border-green-500 text-green-400 bg-green-900/20" : "border-zinc-500 text-zinc-400 bg-zinc-900/20"}
                              `}
                              >
                                {alert.status === "active" ? "Active" : "Inactive"}
                              </Badge>
                            </div>
                            <p className="text-sm text-zinc-400 mb-2">{alert.condition}</p>
                            <div className="flex items-center gap-2 text-xs text-zinc-500">
                              <Clock className="w-3 h-3" />
                              <span>
                                {alert.lastTriggered
                                  ? `Last triggered: ${new Date(alert.lastTriggered).toLocaleDateString()}`
                                  : "Never triggered"}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1">
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center ${alert.notifications.email ? "bg-purple-900/30 text-purple-400" : "bg-zinc-800/50 text-zinc-500"}`}
                            >
                              <span className="text-xs">E</span>
                            </div>
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center ${alert.notifications.push ? "bg-purple-900/30 text-purple-400" : "bg-zinc-800/50 text-zinc-500"}`}
                            >
                              <span className="text-xs">P</span>
                            </div>
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center ${alert.notifications.sms ? "bg-purple-900/30 text-purple-400" : "bg-zinc-800/50 text-zinc-500"}`}
                            >
                              <span className="text-xs">S</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-zinc-300">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                            <Switch checked={alert.status === "active"} />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              {alerts.filter((alert) => alert.type === category).length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 bg-zinc-900/30 rounded-lg border border-zinc-800/50">
                  <BellOff className="w-12 h-12 text-zinc-700 mb-4" />
                  <h3 className="text-lg font-medium text-zinc-400 mb-2">No {category} alerts</h3>
                  <p className="text-sm text-zinc-500 mb-4 text-center max-w-md">
                    You haven&apos;t created any {category} alerts yet. Create one to get notified about important
                    events.
                  </p>
                  <Button className="gradient-button" onClick={() => setShowNewAlertModal(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create {category.charAt(0).toUpperCase() + category.slice(1)} Alert
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* New Alert Modal */}
      {showNewAlertModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 rounded-xl w-full max-w-md">
            <div className="p-4 border-b border-zinc-800">
              <h3 className="text-lg font-semibold text-white">Create New Alert</h3>
              <p className="text-sm text-zinc-400">Configure a new alert for your portfolio</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <span className="text-sm text-zinc-400">Alert Name</span>
                <Input
                  placeholder="Enter alert name"
                  defaultValue=""
                  className="bg-zinc-900/50 border-zinc-700 text-zinc-300 focus-visible:ring-purple-500"
                />
              </div>

              <div className="space-y-2">
                <span className="text-sm text-zinc-400">Alert Type</span>
                <Select defaultValue="performance">
                  <SelectTrigger className="w-full bg-zinc-900/50 border-zinc-700 text-zinc-300">
                    <SelectValue placeholder="Select alert type" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-800">
                    <SelectItem value="performance">Performance Alert</SelectItem>
                    <SelectItem value="risk">Risk Alert</SelectItem>
                    <SelectItem value="strategy">Strategy Alert</SelectItem>
                    <SelectItem value="market">Market Alert</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <span className="text-sm text-zinc-400">Condition</span>
                <Select defaultValue="portfolio_up">
                  <SelectTrigger className="w-full bg-zinc-900/50 border-zinc-700 text-zinc-300">
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-800">
                    <SelectItem value="portfolio_up">Portfolio up by X%</SelectItem>
                    <SelectItem value="portfolio_down">Portfolio down by X%</SelectItem>
                    <SelectItem value="strategy_up">Strategy up by X%</SelectItem>
                    <SelectItem value="strategy_down">Strategy down by X%</SelectItem>
                    <SelectItem value="drawdown">Drawdown exceeds X%</SelectItem>
                    <SelectItem value="volatility">Market volatility exceeds X%</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <span className="text-sm text-zinc-400">Threshold (%)</span>
                <Input
                  type="number"
                  placeholder="5"
                  defaultValue=""
                  className="bg-zinc-900/50 border-zinc-700 text-zinc-300 focus-visible:ring-purple-500"
                />
              </div>

              <div className="space-y-2">
                <span className="text-sm text-zinc-400">Time Period</span>
                <Select defaultValue="day">
                  <SelectTrigger className="w-full bg-zinc-900/50 border-zinc-700 text-zinc-300">
                    <SelectValue placeholder="Select time period" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-800">
                    <SelectItem value="hour">1 Hour</SelectItem>
                    <SelectItem value="day">1 Day</SelectItem>
                    <SelectItem value="week">1 Week</SelectItem>
                    <SelectItem value="month">1 Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <span className="text-sm text-zinc-400">Notification Methods</span>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="email-notify"
                      className="rounded bg-zinc-800 border-zinc-700 text-purple-500"
                      defaultChecked
                    />
                    <label htmlFor="email-notify" className="text-sm text-zinc-400">
                      Email
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="push-notify"
                      className="rounded bg-zinc-800 border-zinc-700 text-purple-500"
                      defaultChecked
                    />
                    <label htmlFor="push-notify" className="text-sm text-zinc-400">
                      Push
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="sms-notify"
                      className="rounded bg-zinc-800 border-zinc-700 text-purple-500"
                    />
                    <label htmlFor="sms-notify" className="text-sm text-zinc-400">
                      SMS
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-zinc-800 flex justify-end gap-2">
              <Button
                variant="outline"
                className="border-zinc-700 text-zinc-300"
                onClick={() => setShowNewAlertModal(false)}
              >
                Cancel
              </Button>
              <Button className="gradient-button" onClick={() => setShowNewAlertModal(false)}>
                Create Alert
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
