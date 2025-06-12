import React from 'react';
import { useFollowUps } from '../../hooks/useFollowUps';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { AlertTriangle, CheckCircle2, Clock, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

const StatusIcon = ({ status }: { status: string }) => {
  switch (status) {
    case 'pendente':
      return <Clock className="h-5 w-5 text-yellow-500" />;
    case 'enviado':
      return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    case 'falhou':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
    default:
      return null;
  }
};

interface FollowUpsTableProps {
  pacienteId?: string;
}

const FollowUpsTable = ({ pacienteId }: FollowUpsTableProps) => {
  const { data: followUps, isLoading, isError } = useFollowUps(pacienteId);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        <p className="ml-2 text-gray-600">Carregando acompanhamentos...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-64 bg-red-50 border border-red-200 rounded-lg">
        <AlertTriangle className="h-8 w-8 text-red-500" />
        <p className="ml-2 text-red-600 font-medium">Ocorreu um erro ao buscar os dados.</p>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Próximos Envios</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Status</TableHead>
              <TableHead>Paciente</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead className="text-right">Data Programada</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {followUps && followUps.length > 0 ? (
              followUps.map((followUp) => (
                <TableRow key={followUp.id}>
                  <TableCell>
                    <StatusIcon status={followUp.status} />
                  </TableCell>
                  <TableCell className="font-medium">{followUp.pacientes?.nome || 'N/A'}</TableCell>
                  <TableCell>{followUp.tag}</TableCell>
                  <TableCell className="text-right">
                    {format(new Date(followUp.dt_envio), "dd/MM/yyyy 'às' HH:mm")}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  Nenhum acompanhamento pendente encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default FollowUpsTable; 