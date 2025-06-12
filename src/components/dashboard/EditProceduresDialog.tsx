import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface EditProceduresDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentValue: number;
  onSave: (newValue: number) => Promise<void>;
}

const EditProceduresDialog = ({ open, onOpenChange, currentValue, onSave }: EditProceduresDialogProps) => {
  const [value, setValue] = useState(currentValue);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setValue(currentValue);
  }, [currentValue]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await onSave(Number(value));
      toast.success('Número de procedimentos atualizado com sucesso!');
      onOpenChange(false);
    } catch (error) {
      toast.error('Ocorreu um erro ao atualizar o valor.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Procedimentos Realizados</DialogTitle>
          <DialogDescription>
            Atualize o número total de procedimentos monitorados pela clínica. Este valor serve como base para outros cálculos de métricas.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="procedures" className="text-right">
              Valor
            </Label>
            <Input
              id="procedures"
              type="number"
              value={value}
              onChange={(e) => setValue(Number(e.target.value))}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button type="submit" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditProceduresDialog; 