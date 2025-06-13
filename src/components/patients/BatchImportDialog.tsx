import { useState, useRef, ChangeEvent, DragEvent } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Download, File, FileSpreadsheet, Info, UploadCloud, X } from "lucide-react";
import clsx from "clsx";
import Papa from "papaparse";
import { z } from "zod";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

interface BatchImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function BatchImportDialog({ open, onOpenChange }: BatchImportDialogProps) {
  const { profile } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [rows, setRows] = useState<any[]>([]);
  const [validRows, setValidRows] = useState<any[]>([]);
  const [invalidRows, setInvalidRows] = useState<{ row: any; errors: string[] }[]>([]);
  const [parsing, setParsing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [sending, setSending] = useState(false);
  const [sendProgress, setSendProgress] = useState(0);

  const validMimeTypes = ["text/csv", "application/vnd.ms-excel"];

  const startFakeUpload = () => {
    setUploading(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 7;
        if (next >= 100) {
          clearInterval(interval);
          setProgress(100);
          setUploading(false);
        }
        return next;
      });
    }, 180);
  };

  const handleFile = (f?: File) => {
    if (!f) return;
    if (!validMimeTypes.includes(f.type) && !f.name.endsWith(".csv")) {
      toast.error("Apenas arquivos CSV são permitidos");
      return;
    }
    setFile(f);
    startFakeUpload();

    // Quando upload simulado completar, parsear CSV
    setTimeout(() => {
      parseCSV(f);
    }, 2000); // coincide com progresso ~100
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleFile(e.dataTransfer.files?.[0]);
  };

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleFile(e.target.files?.[0]);
  };

  const triggerBrowse = () => inputRef.current?.click();

  const reset = () => {
    setFile(null);
    setProgress(0);
    setUploading(false);
    setRows([]);
    setValidRows([]);
    setInvalidRows([]);
    setParsing(false);
    if (inputRef.current) inputRef.current.value = "";
  };

  // Schema de validação para importação unificada
  const unifiedImportSchema = z.object({
    paciente_nome: z.string().min(1, "Nome do paciente é obrigatório"),
    paciente_email: z.string().email({ message: "E-mail do paciente inválido" }).optional().or(z.literal("")),
    paciente_telefone: z.string().optional(),
    paciente_cpf: z.string().optional(),
    paciente_data_nascimento: z.string().optional(),
    medico_id: z.string().uuid("ID de médico inválido"),
    data_procedimento: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: "Data de procedimento inválida",
    }),
    observacoes_procedimento: z.string().optional(),
  });

  const handleDownloadTemplate = () => {
    const headers = [
      "paciente_nome",
      "paciente_email",
      "paciente_telefone",
      "paciente_cpf",
      "paciente_data_nascimento",
      "medico_id",
      "data_procedimento",
      "observacoes_procedimento",
    ];
    const example = [
      "Ex: Nome Sobrenome",
      "email@exemplo.com",
      "11987654321",
      "12345678900",
      "1990-05-20",
      "insira-o-id-do-medico-aqui",
      "2024-08-15 10:30:00",
      "Primeira consulta",
    ];

    const csv = Papa.unparse([headers, example], { header: false });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `modelo_importacao_unificada.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const validateRows = (data: any[]) => {
    const valids: any[] = [];
    const invalids: { row: any; errors: string[] }[] = [];
    data.forEach((row) => {
      const result = unifiedImportSchema.safeParse(row);
      if (result.success) {
        valids.push(result.data);
      } else {
        invalids.push({ row, errors: result.error.errors.map((e) => e.message) });
      }
    });
    setValidRows(valids);
    setInvalidRows(invalids);
  };

  const parseCSV = (f: File) => {
    setParsing(true);
    Papa.parse(f, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const data = results.data as any[];
        setRows(data);
        validateRows(data);
        setParsing(false);
      },
      error: (err) => {
        console.error(err);
        toast.error("Erro ao ler CSV");
        setParsing(false);
      },
    });
  };

  const confirmImport = async () => {
    if (!profile?.organizacao_id) {
      toast.error("Não foi possível identificar a organização. A importação foi cancelada.");
      return;
    }

    try {
      setSending(true);
      let sent = 0;
      let errors = 0;

      for (const record of validRows) {
        const { error } = await supabase.rpc("create_patient_with_procedure", {
          patient_nome: record.paciente_nome,
          patient_email: record.paciente_email,
          patient_telefone: record.paciente_telefone,
          patient_cpf: record.paciente_cpf || null,
          patient_data_nascimento: record.paciente_data_nascimento || null,
          patient_organizacao_id: profile.organizacao_id,
          proc_medico_id: record.medico_id,
          proc_data_procedimento: record.data_procedimento,
          proc_observacoes: record.observacoes_procedimento,
        });

        if (error) {
          console.error(`Erro no registro: ${JSON.stringify(record)}`, error);
          errors++;
        } else {
          sent++;
        }
        
        setSendProgress(Math.round(((sent + errors) / validRows.length) * 100));
      }

      if (errors > 0) {
        toast.error(`${errors} de ${validRows.length} registros falharam ao importar.`);
      } else {
        toast.success(`${sent} registros importados com sucesso!`);
      }

      onOpenChange(false);
    } catch (err) {
      console.error(err);
      toast.error("Falha inesperada na importação");
    } finally {
      setSending(false);
      setSendProgress(0);
      reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Assistente de Importação Unificada</DialogTitle>
        </DialogHeader>

        <Button variant="link" onClick={handleDownloadTemplate} className="gap-2">
          <Download className="w-4 h-4" />
          Baixar modelo de CSV
        </Button>

        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Atenção aos Formatos!</AlertTitle>
          <AlertDescription>
            <ul className="list-disc pl-5 space-y-1 mt-2 text-sm">
              <li>
                <b>Datas:</b> Nascimento em <code>AAAA-MM-DD</code> e
                Procedimento em <code>AAAA-MM-DD HH:mm:ss</code>.
              </li>
              <li>
                <b>Telefone:</b> Apenas números, com DDD. Ex:{" "}
                <code>11987654321</code>.
              </li>
              <li>
                <b>ID do Médico:</b> Insira o identificador único do médico.
              </li>
            </ul>
          </AlertDescription>
        </Alert>

        {/* Drop zone */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
          onClick={triggerBrowse}
          className={clsx(
            "flex flex-col items-center justify-center gap-3 border-2 border-dashed border-zinc-300 rounded-lg p-8 cursor-pointer hover:border-ninacare-primary/60 transition-colors",
            uploading && "opacity-70 pointer-events-none"
          )}
        >
          <UploadCloud className="w-12 h-12 text-zinc-400" />
          <p className="text-sm text-zinc-600">Arraste o arquivo aqui ou clique para selecionar</p>
          <p className="text-xs text-zinc-500">Apenas arquivos CSV (máx. 10MB)</p>
          <input
            ref={inputRef}
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={onFileChange}
          />
        </div>

        {/* Preview / progress */}
        {file && (
          <div className="mt-4 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-sm bg-zinc-100 ring-1 ring-zinc-200">
              <FileSpreadsheet className="w-5 h-5 text-zinc-700" />
            </span>
            <div className="flex-1">
              <p className="text-sm font-medium text-zinc-800 truncate" title={file.name}>
                {file.name}
              </p>
              <Progress value={progress} className="h-1.5" />
            </div>
            <Button variant="ghost" size="icon" onClick={reset} disabled={uploading}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* Preview */}
        {rows.length > 0 && (
          <div className="mt-6 space-y-3 max-h-64 overflow-auto">
            <p className="text-sm text-zinc-600">
              Registros válidos: {validRows.length} | Inválidos: {invalidRows.length}
            </p>
            <Table>
              <TableHeader>
                <TableRow>
                  {Object.keys(rows[0]).map((key) => (
                    <TableHead key={key} className="whitespace-nowrap">
                      {key}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.slice(0, 10).map((r, idx) => {
                  const invalid = invalidRows.find((ir) => ir.row === r);
                  return (
                    <TableRow key={idx} className={invalid ? "bg-red-50" : ""}>
                      {Object.values(r).map((v, i) => (
                        <TableCell key={i} className="truncate max-w-[150px]">
                          {String(v)}
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Actions */}
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={parsing}>Cancelar</Button>
          <Button onClick={confirmImport} disabled={parsing || validRows.length === 0 || sending}>
            {sending ? `Enviando... ${sendProgress}%` : `Importar ${validRows.length}`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 