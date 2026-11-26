import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSubmitEnquiryMutation } from "@/hooks/use-enquiries";
import { Loader2, ArrowRight, CheckCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { gtagEvent } from "@/lib/gtag";

export function CorporateEnquiryForm() {
  const { lang } = useLanguage();
  const mutation = useSubmitEnquiryMutation();
  const [submitted, setSubmitted] = useState(false);

  const t = {
    companyName: lang === "zh" ? "公司名稱 / 機構名稱" : "Organisation Name",
    contactName: lang === "zh" ? "聯絡人姓名" : "Contact Name",
    email: lang === "zh" ? "工作電郵" : "Work Email",
    phone: lang === "zh" ? "聯絡電話" : "Phone Number",
    plannedDate: lang === "zh" ? "預計日期" : "Proposed Date",
    plannedParticipants: lang === "zh" ? "預計人數" : "Participant Count",
    venue: lang === "zh" ? "期望場地" : "Preferred Venue",
    objectives: lang === "zh" ? "核心目標" : "Primary Objectives",
    trainingLang: lang === "zh" ? "培訓語言" : "Preferred Language",
    details: lang === "zh" ? "詳細訊息" : "Message / Details",
    submit: lang === "zh" ? "提交查詢" : "Submit Enquiry",
    submitting: lang === "zh" ? "提交中..." : "Submitting...",
    success: lang === "zh" ? "我們已收到您的查詢，將會盡快與您聯絡。" : "Enquiry received. We will contact you soon.",
    venueOptions: [
      { value: "indoor", label: lang === "zh" ? "室內場地" : "Indoor Venue" },
      { value: "outdoor", label: lang === "zh" ? "戶外場地" : "Outdoor Venue" },
      { value: "office", label: lang === "zh" ? "辦公室" : "Office / On-site" },
      { value: "undecided", label: lang === "zh" ? "尚未決定" : "To be decided" }
    ],
    langOptions: [
      { value: "cantonese", label: lang === "zh" ? "廣東話" : "Cantonese" },
      { value: "english", label: lang === "zh" ? "英語" : "English" },
      { value: "mandarin", label: lang === "zh" ? "普通話" : "Mandarin" },
      { value: "mixed", label: lang === "zh" ? "雙語/混合" : "Bilingual / Mixed" }
    ]
  };

  const formSchema = z.object({
    schoolName: z.string().min(2, lang === "zh" ? "請填寫機構名稱" : "Required"),
    contactName: z.string().min(2, lang === "zh" ? "請填寫聯絡人姓名" : "Required"),
    contactEmail: z.string().email(lang === "zh" ? "格式不正確" : "Invalid email").optional().or(z.literal("")),
    contactPhone: z.string().min(8, lang === "zh" ? "格式不正確" : "Invalid phone").optional().or(z.literal("")),
    plannedDate: z.string().optional(),
    plannedParticipants: z.string().optional(),
    venue: z.string().optional(),
    objectives: z.string().optional(),
    trainingLang: z.string().optional(),
    message: z.string().min(5, lang === "zh" ? "請提供更多細節" : "Please provide more details")
  }).refine((data) => data.contactEmail || data.contactPhone, {
    message: lang === "zh" ? "請提供最少一項聯絡方式 (電郵或電話)" : "Please provide at least one contact method (email or phone)",
    path: ["contactEmail"],
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      schoolName: "",
      contactName: "",
      contactEmail: "",
      contactPhone: "",
      plannedDate: "",
      plannedParticipants: "",
      venue: "",
      objectives: "",
      trainingLang: "",
      message: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const venueLabel = t.venueOptions.find(o => o.value === values.venue)?.label || 'Not specified';
    const langLabel = t.langOptions.find(o => o.value === values.trainingLang)?.label || 'Not specified';

    // Encode unsupported fields clearly into the message
    const formattedMessage = `
[Corporate Enquiry Details]
Venue Preference: ${venueLabel}
Training Language: ${langLabel}
Primary Objectives: ${values.objectives || 'Not specified'}

[Additional Message]
${values.message}
    `.trim();

    mutation.mutate({
      data: {
        schoolName: values.schoolName,
        contactName: values.contactName,
        contactEmail: values.contactEmail || undefined,
        contactPhone: values.contactPhone || undefined,
        plannedDate: values.plannedDate || undefined,
        plannedParticipants: values.plannedParticipants || undefined,
        schoolType: "company",
        activityInterest: "Corporate Team Building",
        message: formattedMessage
      }
    }, {
      onSuccess: () => {
        gtagEvent("enquiry_form_submit", { category: "corporate" });
        setSubmitted(true);
      }
    });
  };

  if (submitted) {
    return (
      <div className="bg-[#162033] rounded-xl border border-[#162033] p-10 md:p-14 flex flex-col items-center justify-center text-center h-full min-h-[400px]">
        <CheckCircle className="w-16 h-16 text-[#4C9AFF] mb-6" />
        <h3 className="text-2xl font-bold text-white mb-3">
          {lang === "zh" ? "查詢已成功提交" : "Enquiry Submitted"}
        </h3>
        <p className="text-[#9CA3AF] max-w-md">
          {t.success}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#162033] rounded-xl border border-[#162033] p-8 md:p-12 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#4C9AFF] opacity-[0.03] blur-[100px] pointer-events-none" />
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField control={form.control} name="schoolName" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#9CA3AF] text-sm">{t.companyName} *</FormLabel>
                <FormControl>
                  <Input {...field} className="bg-[#0B1220] border-[#0B1220] text-white focus-visible:ring-2 focus-visible:ring-[#4C9AFF] rounded-lg h-12 text-base" />
                </FormControl>
                <FormMessage className="text-[#FF8A3D] text-sm" />
              </FormItem>
            )} />
            <FormField control={form.control} name="contactName" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#9CA3AF] text-sm">{t.contactName} *</FormLabel>
                <FormControl>
                  <Input {...field} className="bg-[#0B1220] border-[#0B1220] text-white focus-visible:ring-2 focus-visible:ring-[#4C9AFF] rounded-lg h-12 text-base" />
                </FormControl>
                <FormMessage className="text-[#FF8A3D] text-sm" />
              </FormItem>
            )} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField control={form.control} name="contactEmail" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#9CA3AF] text-sm">{t.email}</FormLabel>
                <FormControl>
                  <Input type="email" {...field} className="bg-[#0B1220] border-[#0B1220] text-white focus-visible:ring-2 focus-visible:ring-[#4C9AFF] rounded-lg h-12 text-base" />
                </FormControl>
                <FormMessage className="text-[#FF8A3D] text-sm" />
              </FormItem>
            )} />
            <FormField control={form.control} name="contactPhone" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#9CA3AF] text-sm">{t.phone}</FormLabel>
                <FormControl>
                  <Input type="tel" {...field} className="bg-[#0B1220] border-[#0B1220] text-white focus-visible:ring-2 focus-visible:ring-[#4C9AFF] rounded-lg h-12 text-base" />
                </FormControl>
                <FormMessage className="text-[#FF8A3D] text-sm" />
              </FormItem>
            )} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField control={form.control} name="plannedDate" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#9CA3AF] text-sm">{t.plannedDate}</FormLabel>
                <FormControl>
                  <Input {...field} placeholder={lang === "zh" ? "例如：2024年3月" : "e.g., March 2024"} className="bg-[#0B1220] border-[#0B1220] text-white focus-visible:ring-2 focus-visible:ring-[#4C9AFF] rounded-lg h-12 text-base" />
                </FormControl>
              </FormItem>
            )} />
            <FormField control={form.control} name="plannedParticipants" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#9CA3AF] text-sm">{t.plannedParticipants}</FormLabel>
                <FormControl>
                  <Input type="number" {...field} placeholder="0" className="bg-[#0B1220] border-[#0B1220] text-white focus-visible:ring-2 focus-visible:ring-[#4C9AFF] rounded-lg h-12 text-base" />
                </FormControl>
              </FormItem>
            )} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField control={form.control} name="venue" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#9CA3AF] text-sm">{t.venue}</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || undefined}>
                  <FormControl>
                    <SelectTrigger className="bg-[#0B1220] border-[#0B1220] text-white focus-visible:ring-2 focus-visible:ring-[#4C9AFF] rounded-lg h-12 text-base">
                      <SelectValue placeholder="-" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-[#162033] border-[#0B1220] text-white rounded-lg">
                    {t.venueOptions.map(opt => (
                      <SelectItem key={opt.value} value={opt.value} className="focus:bg-[#0B1220] focus:text-white rounded-md cursor-pointer">{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )} />
            <FormField control={form.control} name="trainingLang" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#9CA3AF] text-sm">{t.trainingLang}</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || undefined}>
                  <FormControl>
                    <SelectTrigger className="bg-[#0B1220] border-[#0B1220] text-white focus-visible:ring-2 focus-visible:ring-[#4C9AFF] rounded-lg h-12 text-base">
                      <SelectValue placeholder="-" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-[#162033] border-[#0B1220] text-white rounded-lg">
                    {t.langOptions.map(opt => (
                      <SelectItem key={opt.value} value={opt.value} className="focus:bg-[#0B1220] focus:text-white rounded-md cursor-pointer">{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )} />
          </div>

          <FormField control={form.control} name="objectives" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#9CA3AF] text-sm">{t.objectives}</FormLabel>
              <FormControl>
                <Input placeholder={lang === "zh" ? "例如：促進跨部門協作..." : "e.g., Promote cross-departmental collaboration..."} {...field} className="bg-[#0B1220] border-[#0B1220] text-white focus-visible:ring-2 focus-visible:ring-[#4C9AFF] rounded-lg h-12 text-base" />
              </FormControl>
            </FormItem>
          )} />

          <FormField control={form.control} name="message" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#9CA3AF] text-sm">{t.details} *</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder={lang === "zh" ? "請提供更多細節或特別要求..." : "Please provide more details or specific requirements..."}
                  className="bg-[#0B1220] border-[#0B1220] text-white focus-visible:ring-2 focus-visible:ring-[#4C9AFF] rounded-lg min-h-[120px] resize-none text-base" 
                  {...field} 
                />
              </FormControl>
              <FormMessage className="text-[#FF8A3D] text-sm" />
            </FormItem>
          )} />

          {mutation.isError && (
            <div className="bg-[#FF8A3D]/10 border border-[#FF8A3D]/30 text-[#FF8A3D] p-4 text-sm rounded-lg">
              {lang === "zh" ? "提交失敗，請稍後再試。" : "Submission failed. Please try again later."}
            </div>
          )}

          <Button 
            type="submit" 
            disabled={mutation.isPending}
            className="w-full h-12 md:h-14 bg-[#FF8A3D] hover:bg-[#E6752D] text-white font-bold text-base md:text-lg rounded-lg transition-colors group flex items-center justify-center border-none"
          >
            {mutation.isPending ? (
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
            ) : null}
            <span>{mutation.isPending ? t.submitting : t.submit}</span>
            {!mutation.isPending && <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />}
          </Button>
        </form>
      </Form>
    </div>
  );
}