import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { QrCode, Download } from "lucide-react";
import { membershipApi, API_ORIGIN } from "@/api";
import Loader from "@/components/Loader";
import { toast } from "sonner";



function MemberCardPage() {
  const { id } = useParams() as any;
  const { data: card, isLoading } = useQuery({
    queryKey: ["membership", id],
    queryFn: () => membershipApi.getCard(id),
    retry: false,
  });

  if (isLoading) return <Loader isLoading={true} />;

  const c = card ?? {
    id, memberNumber: "ACEEMUB -0001", firstName: "Membre", lastName: "ACEEMUB ",
    email: "", phone: "", school: "Université d'Abomey-Calavi",
    level: "Licence 2", city: "Cotonou", photoDataUrl: null,
    qrCode: "", isActive: true, createdAt: new Date().toISOString(),
  };

  if (!card) {
    return (
      <div className="mx-auto max-w-md px-5 pt-8 text-center">
        <p className="text-muted-foreground">Carte membre introuvable</p>
      </div>
    );
  }

  const handleDownloadPDF = async () => {
    try {
      const response = await fetch(`${API_ORIGIN}/api/membership/${id}/pdf`);
      if (!response.ok) throw new Error("Échec du téléchargement");
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `carte-membre-${c.memberNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("Carte téléchargée !");
    } catch {
      toast.error("Impossible de télécharger la carte");
    }
  };

  return (
    <div className="mx-auto max-w-md px-5 pt-8">
      <article className="overflow-hidden rounded-3xl bg-foreground text-background shadow-elevated">
        <div className="bg-gradient-warm p-5 text-primary-foreground">
          <div className="flex items-center justify-between">
            <div className="text-xs uppercase tracking-widest opacity-80">ACEEMUB  · Carte de membre</div>
            <div className="text-[10px] uppercase tracking-widest opacity-80">{c.isActive ? "Active" : "Inactive"}</div>
          </div>
          <div className="mt-5 flex items-center gap-4">
            {c.photoDataUrl ? (
              <img src={c.photoDataUrl} alt={c.firstName} className="h-20 w-20 rounded-2xl object-cover" />
            ) : (
              <div className="grid h-20 w-20 place-items-center rounded-2xl bg-background/20 font-serif text-3xl">
                {c.firstName[0]}{c.lastName[0]}
              </div>
            )}
            <div>
              <div className="font-serif text-2xl leading-tight">{c.firstName} {c.lastName}</div>
              <div className="text-xs opacity-80">{c.memberNumber}</div>
            </div>
          </div>
        </div>

        <dl className="grid grid-cols-2 gap-4 p-5 text-sm">
          <Info k="Établissement" v={c.school} />
          <Info k="Niveau" v={c.level} />
          <Info k="Ville" v={c.city} />
          <Info k="Émise le" v={new Date(c.createdAt).toLocaleDateString("fr-FR")} />
        </dl>

        <div className="border-t border-background/10 p-5 text-center">
          {c.qrCode ? (
            <img src={c.qrCode} alt="QR Code" className="mx-auto h-28 w-28 rounded-2xl" />
          ) : (
            <div className="mx-auto grid h-28 w-28 place-items-center rounded-2xl bg-background text-foreground">
              <QrCode className="h-16 w-16" />
            </div>
          )}
          <p className="mt-2 text-[11px] uppercase tracking-widest opacity-70">Scanne pour vérifier</p>
        </div>
      </article>

      <button
        onClick={handleDownloadPDF}
        className="mt-4 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary text-sm font-medium text-primary-foreground hover:bg-primary/90"
      >
        <Download className="h-4 w-4" /> Télécharger la carte PDF
      </button>
    </div>
  );
}

function Info({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <dt className="text-[10px] uppercase tracking-widest opacity-60">{k}</dt>
      <dd className="font-medium">{v}</dd>
    </div>
  );
}

export default MemberCardPage;
