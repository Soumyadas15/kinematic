import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/registry/kinematic/ui/accordion"

const faqs = [
  {
    value: "billing",
    question: "When am I charged?",
    answer:
      "You're billed on the first of each month for the seats you used. Removing a seat mid-cycle credits the unused days to your next invoice.",
  },
  {
    value: "export",
    question: "Can I export my data?",
    answer:
      "Yes. Every workspace can export projects, comments and attachments as a zip from Settings. Exports usually finish within a few minutes.",
  },
  {
    value: "sso",
    question: "Do you support single sign-on?",
    answer:
      "SAML and OIDC are available on the Business plan. Once connected, members sign in with your identity provider and new accounts are provisioned automatically.",
  },
  {
    value: "cancel",
    question: "What happens if I cancel?",
    answer:
      "Your workspace stays read-only for 30 days so you can export anything you need. After that it's deleted permanently.",
  },
]

export default function AccordionDemo() {
  return (
    <Accordion type="single" collapsible defaultValue="billing" className="w-full max-w-md">
      {faqs.map((faq) => (
        <AccordionItem key={faq.value} value={faq.value}>
          <AccordionTrigger>{faq.question}</AccordionTrigger>
          <AccordionContent className="text-muted-foreground">
            {faq.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
