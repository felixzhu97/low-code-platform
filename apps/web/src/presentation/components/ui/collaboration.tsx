"use client";

import { SelectItem } from "./select";
import { SelectContent } from "./select";
import { SelectValue } from "./select";
import { SelectTrigger } from "./select";
import { Select } from "./select";
import { useState, memo } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import { ScrollArea } from "./scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Badge } from "./badge";
import { Users, Send, Copy } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";
import { useAllStores } from "@/presentation/hooks";
import { useUIStore } from "@/shared/stores";

interface CollaborationProps {}

type User = {
  id: string;
  name: string;
  avatar: string;
  online: boolean;
  role: "owner" | "editor" | "viewer";
  lastActive?: string;
};

type Comment = {
  id: string;
  userId: string;
  text: string;
  timestamp: string;
  resolved: boolean;
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const SectionLabel = styled(Label)``;

const SectionInput = styled(Input)`
  flex: 1;
`;

const PermissionCard = styled.div`
  border: 1px solid hsl(var(--border));
  border-radius: calc(var(--radius));
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const PermissionRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const PermissionLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SelectTriggerSmall = styled(SelectTrigger)`
  width: 8rem;
`;

const UserCard = styled.div`
  border: 1px solid hsl(var(--border));
  border-radius: calc(var(--radius));
  padding: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const UserDetails = styled.div``;

const UserNameRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const UserName = styled.span`
  font-weight: 500;
`;

const OnlineDot = styled.div<{ online: boolean }>`
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 9999px;
  background-color: ${(p) => (p.online ? "#22c55e" : "#d1d5db")};
`;

const UserStatus = styled.div`
  font-size: 0.875rem;
  color: hsl(var(--muted-foreground));
`;

const UserActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const UserBadge = styled(Badge)`
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
`;

const AvatarStyled = styled(Avatar)`
  height: 1.5rem;
  width: 1.5rem;
`;

const CommentCard = styled.div<{ resolved: boolean }>`
  border: 1px solid hsl(var(--border));
  border-radius: calc(var(--radius));
  padding: 0.75rem;
  background-color: ${(p) => (p.resolved ? "hsl(var(--muted) / 0.5)" : "transparent")};
`;

const CommentHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const CommentAuthor = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const AvatarSmall = styled(Avatar)`
  height: 1.5rem;
  width: 1.5rem;
`;

const AuthorName = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
`;

const CommentTime = styled.span`
  font-size: 0.75rem;
  color: hsl(var(--muted-foreground));
`;

const CommentText = styled.p<{ resolved: boolean }>`
  font-size: 0.875rem;
  margin-top: 0.5rem;
  color: ${(p) => (p.resolved ? "hsl(var(--muted-foreground))" : "inherit")};
`;

const CommentsSection = styled.div`
  display: flex;
  flex-direction: column;
  height: 18.75rem;
`;

const CommentsList = styled(ScrollArea)`
  flex: 1;
`;

const CommentsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 0.25rem;
`;

const CommentInputRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
`;

export const Collaboration = memo(function Collaboration({}: CollaborationProps) {
  const { projectName } = useUIStore();
  const [shareLink, setShareLink] = useState(
    "https://lowcode.example.com/share/abc123"
  );
  const [message, setMessage] = useState("");
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
  ]);

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
  ]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      userId: "user-1",
      text: message,
      timestamp: "刚刚",
      resolved: false,
    };

    setComments([newComment, ...comments]);
    setMessage("");
  };

  const handleResolveComment = (commentId: string) => {
    setComments(
      comments.map((comment) => {
        if (comment.id === commentId) {
          return { ...comment, resolved: true };
        }
        return comment;
      })
    );
  };

  const toggleUserRole = (userId: string) => {
    setUsers(
      users.map((user) => {
        if (user.id === userId) {
          const newRole = user.role === "editor" ? "viewer" : "editor";
          return { ...user, role: newRole };
        }
        return user;
      })
    );
  };

  const getUserById = (userId: string) => {
    return users.find((user) => user.id === userId);
  };

  const getRoleBadgeVariant = (role: User["role"]) => {
    switch (role) {
      case "owner":
        return "default";
      case "editor":
        return "secondary";
      case "viewer":
        return "outline";
    }
  };

  const getRoleText = (role: User["role"]) => {
    switch (role) {
      case "owner":
        return "所有者";
      case "editor":
        return "编辑者";
      case "viewer":
        return "查看者";
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Users css={{ marginRight: "0.375rem", width: "1rem", height: "1rem" }} aria-hidden="true" />
          协作
        </Button>
      </DialogTrigger>
      <DialogContent css={{ maxWidth: "42rem" }}>
        <DialogHeader>
          <DialogTitle>项目协作</DialogTitle>
          <DialogDescription>邀请他人查看或编辑您的项目</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="share">
          <TabsList css={{ display: "grid", width: "100%", gridTemplateColumns: "repeat(3, 1fr)" }}>
            <TabsTrigger value="share">分享</TabsTrigger>
            <TabsTrigger value="members">成员</TabsTrigger>
            <TabsTrigger value="comments">评论</TabsTrigger>
          </TabsList>

          <TabsContent value="share" css={{ display: "flex", flexDirection: "column", gap: "1rem", paddingTop: "1rem" }}>
            <Wrapper>
              <Section>
                <SectionLabel htmlFor="project-name">项目名称</SectionLabel>
                <SectionInput id="project-name" value={projectName} readOnly />
              </Section>

              <Section>
                <SectionLabel htmlFor="share-link">分享链接</SectionLabel>
                <SectionInput
                  id="share-link"
                  value={shareLink}
                  readOnly
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopyLink}
                  css={{ position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)" }}
                >
                  <Copy css={{ width: "1rem", height: "1rem" }} />
                </Button>
              </Section>

              <Section>
                <SectionLabel>权限设置</SectionLabel>
                <PermissionCard>
                  <PermissionRow>
                    <PermissionLeft>
                      <Badge variant="outline">公开链接</Badge>
                      <span css={{ fontSize: "0.875rem" }}>任何拥有链接的人</span>
                    </PermissionLeft>
                    <Select defaultValue="viewer" onValueChange={() => {}}>
                      <SelectTriggerSmall>
                        <SelectValue placeholder="选择权限" />
                      </SelectTriggerSmall>
                      <SelectContent>
                        <SelectItem value="viewer">只能查看</SelectItem>
                        <SelectItem value="editor">可以编辑</SelectItem>
                      </SelectContent>
                    </Select>
                  </PermissionRow>
                </PermissionCard>
              </Section>

              <Section>
                <SectionLabel>通过邮箱邀请</SectionLabel>
                <SectionInput placeholder="输入邮箱地址" />
                <Button css={{ alignSelf: "flex-start" }}>邀请</Button>
              </Section>
            </Wrapper>
          </TabsContent>

          <TabsContent value="members" css={{ paddingTop: "1rem" }}>
            <ScrollArea css={{ height: "18.75rem" }}>
              <Wrapper>
                {users.map((user) => (
                  <UserCard key={user.id}>
                    <UserInfo>
                      <AvatarStyled>
                        <AvatarImage
                          src={user.avatar || "/placeholder.svg"}
                          alt={user.name}
                        />
                        <AvatarFallback>{user.name[0]}</AvatarFallback>
                      </AvatarStyled>
                      <UserDetails>
                        <UserNameRow>
                          <UserName>{user.name}</UserName>
                          {user.id === "user-1" && (
                            <Badge variant="outline">你</Badge>
                          )}
                          <OnlineDot online={user.online} />
                        </UserNameRow>
                        <UserStatus>
                          {user.lastActive || (user.online ? "在线" : "离线")}
                        </UserStatus>
                      </UserDetails>
                    </UserInfo>
                    <UserActions>
                      <UserBadge variant={getRoleBadgeVariant(user.role)}>
                        {getRoleText(user.role)}
                      </UserBadge>
                      {user.id !== "user-1" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleUserRole(user.id)}
                        >
                          {user.role === "editor" ? "设为查看者" : "设为编辑者"}
                        </Button>
                      )}
                    </UserActions>
                  </UserCard>
                ))}
              </Wrapper>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="comments" css={{ paddingTop: "1rem" }}>
            <CommentsSection>
              <CommentsList>
                <CommentsWrapper>
                  {comments.map((comment) => {
                    const user = getUserById(comment.userId);
                    return (
                      <CommentCard key={comment.id} resolved={comment.resolved}>
                        <CommentHeader>
                          <CommentAuthor>
                            <AvatarSmall>
                              <AvatarImage
                                src={user?.avatar || "/placeholder.svg"}
                                alt={user?.name}
                              />
                              <AvatarFallback>{user?.name[0]}</AvatarFallback>
                            </AvatarSmall>
                            <AuthorName>{user?.name}</AuthorName>
                            <CommentTime>{comment.timestamp}</CommentTime>
                          </CommentAuthor>
                          {!comment.resolved && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleResolveComment(comment.id)}
                            >
                              解决
                            </Button>
                          )}
                        </CommentHeader>
                        <CommentText resolved={comment.resolved}>
                          {comment.text}
                        </CommentText>
                      </CommentCard>
                    );
                  })}
                </CommentsWrapper>
              </CommentsList>
              <CommentInputRow>
                <Input
                  placeholder="添加评论..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <Button size="icon" onClick={handleSendMessage}>
                  <Send css={{ width: "1rem", height: "1rem" }} />
                </Button>
              </CommentInputRow>
            </CommentsSection>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
});
