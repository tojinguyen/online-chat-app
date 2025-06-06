import { Avatar, Badge, Button, Card } from "@/components/ui";
import DashboardPage from "../dashboard-page";

export default function Dashboard() {
  const recentChats = [
    {
      id: 1,
      name: "Alice Johnson",
      lastMessage: "See you tomorrow!",
      time: "5m",
      status: "online",
    },
    {
      id: 2,
      name: "Bob Smith",
      lastMessage: "Thanks for the help!",
      time: "1h",
      status: "offline",
    },
    {
      id: 3,
      name: "Carol Williams",
      lastMessage: "Did you get my files?",
      time: "3h",
      status: "away",
    },
  ];

  return (
    <DashboardPage>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
          <Button
            variant="gradient"
            leftIcon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
            }
          >
            New Chat
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card
            title="Welcome Back"
            subtitle="Here's a summary of your chat activity"
            hover
          >
            <div className="flex justify-between items-center">
              <div className="text-slate-600">
                <div className="flex items-center mb-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-primary-500 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                    <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                  </svg>
                  <span>12 Active Conversations</span>
                </div>
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-secondary-500 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>3 New Friend Requests</span>
                </div>
              </div>
            </div>
          </Card>

          <Card
            title="Recent Chats"
            subtitle="Continue your conversations"
            hover
          >
            <div className="space-y-3">
              {recentChats.map((chat) => (
                <div
                  key={chat.id}
                  className="flex items-center justify-between hover:bg-slate-50 p-2 rounded-lg cursor-pointer"
                >
                  <div className="flex items-center">
                    <Avatar
                      alt={chat.name}
                      size="sm"
                      status={
                        chat.status as "online" | "offline" | "away" | "busy"
                      }
                    />
                    <div className="ml-3">
                      <div className="font-medium text-slate-800">
                        {chat.name}
                      </div>
                      <div className="text-xs text-slate-500 truncate max-w-[150px]">
                        {chat.lastMessage}
                      </div>
                    </div>
                  </div>
                  <Badge size="sm" variant="secondary" rounded>
                    {chat.time}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>

          <Card
            title="Quick Actions"
            subtitle="Frequently used features"
            variant="glass"
            hover
          >
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" size="sm" fullWidth>
                Create Group
              </Button>
              <Button variant="outline" size="sm" fullWidth>
                Find Friends
              </Button>
              <Button variant="outline" size="sm" fullWidth>
                Settings
              </Button>
              <Button variant="outline" size="sm" fullWidth>
                Help Center
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </DashboardPage>
  );
}
