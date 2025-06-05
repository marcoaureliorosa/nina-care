
import { Search, Filter, MoreVertical } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Conversations = () => {
  const conversations = [
    {
      id: 1,
      patientName: "Maria Silva",
      lastMessage: "Estou sentindo um pouco de dor, é normal?",
      timestamp: "10:30",
      unread: 2,
      status: "ativo",
    },
    {
      id: 2,
      patientName: "João Santos",
      lastMessage: "Obrigado pelas orientações!",
      timestamp: "09:15",
      unread: 0,
      status: "resolvido",
    },
    {
      id: 3,
      patientName: "Ana Costa",
      lastMessage: "Quando devo retornar para consulta?",
      timestamp: "08:45",
      unread: 1,
      status: "pendente",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Conversas</h1>
        <Button className="bg-ninacare-primary hover:bg-ninacare-primary/90">
          <Filter className="w-4 h-4 mr-2" />
          Filtrar
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input 
                placeholder="Buscar conversas..." 
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {conversations.map((conversation) => (
              <div 
                key={conversation.id}
                className="flex items-center space-x-4 p-4 hover:bg-gray-50 rounded-lg cursor-pointer border border-gray-200"
              >
                <Avatar>
                  <AvatarImage src={`https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=400&fit=crop&crop=face`} />
                  <AvatarFallback>
                    {conversation.patientName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {conversation.patientName}
                    </h3>
                    <span className="text-sm text-gray-500">{conversation.timestamp}</span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                  <div className="flex items-center mt-1">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      conversation.status === 'ativo' ? 'bg-green-100 text-green-800' :
                      conversation.status === 'pendente' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {conversation.status}
                    </span>
                  </div>
                </div>

                {conversation.unread > 0 && (
                  <div className="bg-ninacare-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium">
                    {conversation.unread}
                  </div>
                )}

                <Button variant="ghost" size="sm">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Conversations;
