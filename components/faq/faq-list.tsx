import { Link } from "@/i18n/navigation";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
  link?: { href: string; label: string };
};

export function FaqList({ items, className }: { items: FaqItem[]; className?: string }) {
  return (
    <Accordion type="single" collapsible className={cn("border-t border-border", className)}>
      {items.map((item) => (
        <AccordionItem key={item.id} value={item.id} className="border-b border-border">
          <AccordionTrigger className="gap-4 py-5 text-left hover:no-underline">
            <span className="text-body font-medium text-foreground">{item.question}</span>
          </AccordionTrigger>
          <AccordionContent className="pb-5">
            <p className="text-body text-muted-foreground">{item.answer}</p>
            {item.link && (
              <Link
                href={item.link.href}
                className="mt-3 inline-block text-small font-medium text-foreground underline underline-offset-4"
              >
                {item.link.label}
              </Link>
            )}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
