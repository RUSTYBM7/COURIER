import { PublicLayout } from "@/components/PublicLayout";
import { useListFaqs } from "@workspace/api-client-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";

export default function Faq() {
  const { data: faqs, isLoading } = useListFaqs();
  const [search, setSearch] = useState("");

  const filteredFaqs = faqs?.filter(
    (f) => f.question.toLowerCase().includes(search.toLowerCase()) || f.answer.toLowerCase().includes(search.toLowerCase())
  );

  type FaqItem = NonNullable<typeof faqs>[number];
  const grouped = filteredFaqs?.reduce<Record<string, FaqItem[]>>((acc, faq) => {
    (acc[faq.category] ??= []).push(faq);
    return acc;
  }, {});

  return (
    <PublicLayout>
      <div className="bg-muted/30 py-16 md:py-24 px-6">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">How can we help?</h1>
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              className="pl-12 h-14 text-lg rounded-2xl glass-card bg-card shadow-sm"
              placeholder="Search for answers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-16">
        {isLoading && <div className="text-center text-muted-foreground">Loading FAQs...</div>}
        
        {grouped && Object.entries(grouped).map(([category, items]) => (
          <div key={category} className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-primary capitalize">{category}</h2>
            <Accordion type="multiple" className="space-y-4">
              {items.map((faq) => (
                <AccordionItem key={faq.id} value={`faq-${faq.id}`} className="bg-card border rounded-xl px-6 data-[state=open]:shadow-sm transition-shadow">
                  <AccordionTrigger className="text-left font-medium hover:no-underline py-4">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-4 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        ))}

        {!isLoading && filteredFaqs?.length === 0 && (
          <div className="text-center py-12 text-muted-foreground bg-card border rounded-2xl">
            No results found for "{search}"
          </div>
        )}
      </div>
    </PublicLayout>
  );
}
