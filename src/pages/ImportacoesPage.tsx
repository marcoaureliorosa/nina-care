
import { useState } from 'react';
import BatchImportDialog from '@/components/patients/BatchImportDialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload } from 'lucide-react';

const ImportacoesPage = () => {
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(true); // Começa aberto

  return (
    <div className="w-full min-h-[calc(100vh-80px)] flex flex-col items-center bg-zinc-50 p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-4xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-800">Importação em Lote</h1>
          <p className="text-zinc-500 mt-1">
            Importe pacientes e seus primeiros procedimentos de uma só vez usando um arquivo CSV.
          </p>
        </header>

        <Card className="bg-white/80 shadow-lg rounded-xl">
          <CardHeader>
            <CardTitle>Instruções de Importação</CardTitle>
            <CardDescription>
              Siga os passos abaixo para garantir que seus dados sejam importados corretamente.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="list-decimal list-inside space-y-2 text-zinc-700">
              <li>
                <strong>Baixe o modelo:</strong> Use o botão no assistente de importação para baixar o arquivo CSV com os cabeçalhos corretos.
              </li>
              <li>
                <strong>Preencha os dados:</strong> Abra o arquivo em um editor de planilhas (Excel, Google Sheets) e preencha as informações dos pacientes e procedimentos. Não altere os nomes das colunas.
              </li>
              <li>
                <strong>Faça o upload:</strong> Salve o arquivo como CSV e faça o upload no assistente.
              </li>
              <li>
                <strong>Valide e importe:</strong> O sistema irá validar os dados. Corrija os erros, se houver, e confirme a importação.
              </li>
            </ul>
            <div className="pt-4">
              <Button onClick={() => setIsImportDialogOpen(true)} className="w-full sm:w-auto">
                <Upload className="w-4 h-4 mr-2" />
                Iniciar Importação
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <BatchImportDialog
        open={isImportDialogOpen}
        onOpenChange={setIsImportDialogOpen}
      />
    </div>
  );
};

export default ImportacoesPage;
