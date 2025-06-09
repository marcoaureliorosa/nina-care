import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Settings, 
  Users, 
  Building2, 
  ShieldCheck, 
  ChevronRight,
  Info,
  ArrowRight
} from "lucide-react";
import OrganizationManagement from '@/components/admin/OrganizationManagement';
import UserManagement from '@/components/admin/UserManagement';
import { useAuth } from '@/contexts/AuthContext';
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

const ConfiguracoesPage = () => {
  const { profile } = useAuth();
  const isAdmin = profile?.role === 'admin';

  return (
    <div className="w-full min-h-[calc(100vh-80px)] flex flex-col bg-zinc-50/50">
      <div className="w-full max-w-7xl mx-auto px-4 md:px-6">
        {/* Header Section */}
        <div className="w-full pt-8 pb-6">
          <div className="ninacare-gradient rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center md:items-end justify-between shadow-lg">
            <div className="flex items-center gap-4 w-full md:w-auto">
              <Avatar className="h-16 w-16 shadow-md border-4 border-white bg-white">
                <Settings className="w-8 h-8 text-ninacare-primary" />
                <AvatarFallback className="bg-ninacare-primary text-white text-xl font-bold">CF</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
                  Configurações
                  <Badge className="ml-2 bg-white/20 text-white border-white/30" variant="secondary">
                    Administração
                  </Badge>
                </h1>
                <p className="text-sm text-white/80 mt-1 font-medium">Gerencie as configurações da sua organização e usuários</p>
              </div>
            </div>
            <div className="mt-4 md:mt-0 text-right w-full md:w-auto">
              <p className="text-base text-white/90 font-medium">Painel de Controle</p>
              <p className="text-xs text-white/70 mt-1">Configurações globais e gerenciamento de acesso</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        {isAdmin ? (
          <div className="w-full mb-12">
            <Tabs defaultValue="organization" className="w-full">
              <TabsList className="mb-6 bg-background/80 border border-border/30">
                <TabsTrigger value="organization" className="flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  <span>Organização</span>
                </TabsTrigger>
                <TabsTrigger value="users" className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>Usuários</span>
                </TabsTrigger>
              </TabsList>
              
              {/* Organization Tab */}
              <TabsContent value="organization" className="space-y-6">
                <Card className="border-border/40 shadow-sm">
                  <CardHeader className="bg-muted/30 pb-4 border-b border-border/20">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <Building2 className="w-5 h-5 text-primary" />
                        </div>
                        <CardTitle className="text-xl">Dados da Organização</CardTitle>
                      </div>
                      <Badge variant="outline" className="flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" />
                        Admin
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Gerencie informações da sua organização como nome, logo, endereço e configurações gerais.
                      </p>
                      <div className="bg-gradient-to-r from-muted/50 to-transparent h-px w-full my-4" />
                      <div className="overflow-visible">
                        <OrganizationManagement />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Quick Access Cards */}
                <div className="grid gap-4 md:grid-cols-3">
                  <Card className="bg-muted/10 hover:bg-muted/20 transition-colors cursor-pointer group">
                    <CardContent className="flex items-center justify-between p-6">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <Settings className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">Preferências</h3>
                          <p className="text-sm text-muted-foreground">Personalize sua experiência</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-muted/10 hover:bg-muted/20 transition-colors cursor-pointer group">
                    <CardContent className="flex items-center justify-between p-6">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <ShieldCheck className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">Segurança</h3>
                          <p className="text-sm text-muted-foreground">Gerencie acesso e segurança</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-muted/10 hover:bg-muted/20 transition-colors cursor-pointer group">
                    <CardContent className="flex items-center justify-between p-6">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <Info className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">Suporte</h3>
                          <p className="text-sm text-muted-foreground">Obtenha ajuda e suporte</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              {/* Users Tab */}
              <TabsContent value="users" className="space-y-6">
                <Card className="border-border/40 shadow-sm">
                  <CardHeader className="bg-muted/30 pb-4 border-b border-border/20">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <Users className="w-5 h-5 text-primary" />
                        </div>
                        <CardTitle className="text-xl">Usuários da Organização</CardTitle>
                      </div>
                      <Badge variant="outline" className="flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" />
                        Admin
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Gerencie os usuários da sua organização, suas permissões e acesso ao sistema.
                      </p>
                      <div className="bg-gradient-to-r from-muted/50 to-transparent h-px w-full my-4" />
                      <div className="overflow-visible">
                        <UserManagement onlyCurrentOrganization />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* User Management Quick Links */}
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                  <Card className="border border-border/30 hover:border-border/60 transition-all">
                    <CardContent className="p-6">
                      <div className="flex flex-col space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="bg-primary/10 p-2 rounded-full">
                            <Users className="w-5 h-5 text-primary" />
                          </div>
                          <h3 className="font-medium">Convites Pendentes</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Visualize e gerencie convites pendentes para novos usuários da organização.
                        </p>
                        <Button variant="outline" size="sm" className="w-full justify-between mt-2">
                          <span>Ver convites</span>
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border border-border/30 hover:border-border/60 transition-all">
                    <CardContent className="p-6">
                      <div className="flex flex-col space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="bg-primary/10 p-2 rounded-full">
                            <ShieldCheck className="w-5 h-5 text-primary" />
                          </div>
                          <h3 className="font-medium">Permissões e Funções</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Configure as permissões e funções dos usuários da sua organização.
                        </p>
                        <Button variant="outline" size="sm" className="w-full justify-between mt-2">
                          <span>Gerenciar permissões</span>
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <div className="w-full max-w-xl mx-auto mb-12">
            <Card className="border-border/40 shadow-sm">
              <CardHeader className="bg-muted/50">
                <div className="flex items-center gap-2">
                  <div className="bg-amber-500/10 p-2 rounded-full">
                    <Info className="w-5 h-5 text-amber-500" />
                  </div>
                  <CardTitle>Acesso Restrito</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-4 py-6">
                  <div className="bg-muted/30 p-4 rounded-full">
                    <ShieldCheck className="w-12 h-12 text-muted-foreground/70" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-medium">Permissão Necessária</h3>
                    <p className="text-muted-foreground max-w-md">
                      Você não tem permissão para acessar as configurações da organização. Entre em contato com um administrador para obter acesso.
                    </p>
                  </div>
                  <Badge variant="outline" className="mt-4">
                    Nível de acesso: Usuário
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfiguracoesPage;
