"use client"

import { SelectItem } from "@/src/presentation/components/ui/select"

import { SelectContent } from "@/src/presentation/components/ui/select"

import { SelectValue } from "@/src/presentation/components/ui/select"

import { SelectTrigger } from "@/src/presentation/components/ui/select"

import { Select } from "@/src/presentation/components/ui/select"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/presentation/components/ui/dialog"
import { Button } from "@/src/presentation/components/ui/button"
import { Input } from "@/src/presentation/components/ui/input"
import { Label } from "@/src/presentation/components/ui/label"
import { ScrollArea } from "@/src/presentation/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/src/presentation/components/ui/avatar"
import { Badge } from "@/src/presentation/components/ui/badge"
import { Users, Send, Copy } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/presentation/components/ui/tabs"

interface CollaborationProps {
  projectName: string
}

type User = {
  id: string
  name: string
  avatar: string
  online: boolean
  role: "owner" | "editor" | "viewer"
  lastActive?: string
}

type Comment = {
  id: string
  userId: string
  text: string
  timestamp: string
  resolved: boolean
}

export function Collaboration({ projectName }: CollaborationProps) {
  const [shareLink, setShareLink] = useState("https://lowcode.example.com/share/abc123")
  const [message, setMessage] = useState("")
  const [comments, setComments] = useState<Comment[]>([
    {
      id: "comment-1",
      userId: "user-2",
      text: "导航栏的按钮间距是否可以调整一下？感觉有点拥挤。",
      timestamp: "10分钟前",
      resolved: false,
    },
    {
      id: "comment-2",
      userId: "user-3",
      text: "我已经完成了表单验证功能，请查看。",
      timestamp: "30分钟前",
      resolved: true,
    },
  ])

  const [users, setUsers] = useState<User[]>([
    {
      id: "user-1",
      name: "你",
      avatar: "/placeholder.svg?height=40&width=40",
      online: true,
      role: "owner",
    },
    {
      id: "user-2",
      name: "张三",
      avatar: "/placeholder.svg?height=40&width=40",
      online: true,
      role: "editor",
      lastActive: "正在编辑...",
    },
    {
      id: "user-3",
      name: "李四",
      avatar: "/placeholder.svg?height=40&width=40",
      online: false,
      role: "viewer",
      lastActive: "10分钟前",
    },
  ])

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink)
  }

  const handleSendMessage = () => {
    if (!message.trim()) return

    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      userId: "user-1",
      text: message,
      timestamp: "刚刚",
      resolved: false,
    }

    setComments([newComment, ...comments])
    setMessage("")
  }

  const handleResolveComment = (commentId: string) => {
    setComments(
      comments.map((comment) => {
        if (comment.id === commentId) {
          return { ...comment, resolved: true }
        }
        return comment
      }),
    )
  }

  const toggleUserRole = (userId: string) => {
    setUsers(
      users.map((user) => {
        if (user.id === userId) {
          const newRole = user.role === "editor" ? "viewer" : "editor"
          return { ...user, role: newRole }
        }
        return user
      }),
    )
  }

  const getUserById = (userId: string) => {
    return users.find((user) => user.id === userId)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Users className="mr-2 h-4 w-4" />
          协作
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>项目协作</DialogTitle>
          <DialogDescription>邀请他人查看或编辑您的项目</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="share">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="share">分享</TabsTrigger>
            <TabsTrigger value="members">成员</TabsTrigger>
            <TabsTrigger value="comments">评论</TabsTrigger>
          </TabsList>

          <TabsContent value="share" className="space-y-4 py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="project-name">项目名称</Label>
                <Input id="project-name" value={projectName} readOnly />
              </div>

              <div className="space-y-2">
                <Label htmlFor="share-link">分享链接</Label>
                <div className="flex items-center gap-2">
                  <Input id="share-link" value={shareLink} readOnly className="flex-1" />
                  <Button variant="outline" size="icon" onClick={handleCopyLink}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>权限设置</Label>
                <div className="flex flex-col gap-2 rounded-md border p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">公开链接</Badge>
                      <span className="text-sm">任何拥有链接的人</span>
                    </div>
                    <Select defaultValue="viewer" onValueChange={() => {}}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="选择权限" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="viewer">只能查看</SelectItem>
                        <SelectItem value="editor">可以编辑</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>通过邮箱邀请</Label>
                <div className="flex items-center gap-2">
                  <Input placeholder="输入邮箱地址" className="flex-1" />
                  <Button>邀请</Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="members" className="py-4">
            <ScrollArea className="h-[300px]">
              <div className="space-y-4">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between rounded-md border p-3">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                        <AvatarFallback>{user.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{user.name}</span>
                          {user.id === "user-1" && <Badge variant="outline">你</Badge>}
                          <span className={`h-2 w-2 rounded-full ${user.online ? "bg-green-500" : "bg-gray-300"}`} />
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {user.lastActive || (user.online ? "在线" : "离线")}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={user.role === "owner" ? "default" : user.role === "editor" ? "secondary" : "outline"}
                      >
                        {user.role === "owner" ? "所有者" : user.role === "editor" ? "编辑者" : "查看者"}
                      </Badge>
                      {user.id !== "user-1" && (
                        <Button variant="ghost" size="sm" onClick={() => toggleUserRole(user.id)}>
                          {user.role === "editor" ? "设为查看者" : "设为编辑者"}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="comments" className="py-4">
            <div className="flex h-[300px] flex-col">
              <ScrollArea className="flex-1">
                <div className="space-y-4 p-1">
                  {comments.map((comment) => {
                    const user = getUserById(comment.userId)
                    return (
                      <div
                        key={comment.id}
                        className={`rounded-md border p-3 ${comment.resolved ? "bg-muted/50" : ""}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name} />
                              <AvatarFallback>{user?.name[0]}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium">{user?.name}</span>
                            <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                          </div>
                          {!comment.resolved && (
                            <Button variant="ghost" size="sm" onClick={() => handleResolveComment(comment.id)}>
                              解决
                            </Button>
                          )}
                        </div>
                        <p className={`mt-2 text-sm ${comment.resolved ? "text-muted-foreground" : ""}`}>
                          {comment.text}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </ScrollArea>
              <div className="mt-4 flex items-center gap-2">
                <Input
                  placeholder="添加评论..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage()
                    }
                  }}
                />
                <Button size="icon" onClick={handleSendMessage}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
