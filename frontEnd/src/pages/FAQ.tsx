
import PageHeader from "@/components/PageHeader";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";



const FAQ = [
  { q: "Qui peut adhérer à l'ACEEMUB  ?", a: "Tout élève ou étudiant musulman du Bénin, quel que soit son établissement, peut demander son adhésion via la page Rejoindre." },
  { q: "L'adhésion est-elle payante ?", a: "Une cotisation symbolique annuelle est demandée pour soutenir les activités de l'association. Le montant est communiqué lors de la validation du dossier." },
  { q: "Comment recevoir ma carte de membre ?", a: "Après validation par le bureau, ta carte digitale est générée immédiatement et accessible depuis ton espace personnel." },
  { q: "Puis-je proposer un article pour le blog ?", a: "Oui ! Contacte la rédaction via la page Contact, en précisant ton thème et un court résumé." },
  { q: "L'ACEEMUB  propose-t-elle un soutien académique ?", a: "Oui — bourses, tutorat, mentorat et orientation post-bac, selon les besoins identifiés." },
  { q: "Comment être bénévole sur un événement ?", a: "Inscris-toi via la page Événements ou écris-nous via le formulaire de contact." },
];

function FAQPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        eyebrow="FAQ"
        title="Vos questions, nos réponses"
        description="Tout ce qu'il faut savoir avant de rejoindre l'ACEEMUB ."
      />
      <div className="px-5">
        <Accordion type="single" collapsible className="rounded-3xl border border-border bg-card shadow-card">
          {FAQ.map((f, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border-b last:border-0 px-5">
              <AccordionTrigger className="text-left font-serif text-lg">{f.q}</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}

export default FAQPage;
