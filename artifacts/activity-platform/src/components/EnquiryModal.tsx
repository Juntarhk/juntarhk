import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useSubmitEnquiryMutation } from "@/hooks/use-enquiries";
import { useToast } from "@/hooks/use-toast";
import { Send, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface EnquiryModalProps {
  activityTitle?: string;
  trigger?: React.ReactNode;
}

export function EnquiryModal({ activityTitle, trigger }: EnquiryModalProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const { t, lang } = useLanguage();
  const eq = t.enquiry;
  const mutation = useSubmitEnquiryMutation();

  const atLeastOneContactMsg = lang === "zh"
    ? "請填寫電話或電郵（二選一必填）"
    : "Please provide at least a phone number or email";

  const formSchema = z.object({
    schoolName: z.string().min(2, lang === "zh" ? "請輸入機構名稱" : "Please enter your organization name"),
    contactName: z.string().min(2, lang === "zh" ? "請輸入聯絡人姓名" : "Please enter your name"),
    contactEmail: z.string().optional().refine(
      v => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
      { message: lang === "zh" ? "請輸入有效的電郵地址" : "Please enter a valid email address" }
    ),
    contactPhone: z.string().optional().refine(
      v => !v || v.replace(/\s/g, "").length >= 8,
      { message: lang === "zh" ? "請輸入有效的聯絡電話" : "Please enter a valid phone number" }
    ),
    schoolType: z.enum(["kindergarten", "primary", "secondary", "tertiary", "ngo", "company", "others"], {
      required_error: lang === "zh" ? "請選擇機構類型" : "Please select an organization type",
    }),
    activityCategory: z.string().optional(),
    plannedDate: z.string().optional(),
    plannedParticipants: z.string().optional(),
    message: z.string().min(10, lang === "zh" ? "請填寫最少10個字的訊息" : "Please enter at least 10 characters"),
    activityInterest: z.string().optional(),
  }).superRefine(({ contactPhone, contactEmail }, ctx) => {
    if (!contactPhone && !contactEmail) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: atLeastOneContactMsg, path: ["contactPhone"] });
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: atLeastOneContactMsg, path: ["contactEmail"] });
    }
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      schoolName: "",
      contactName: "",
      contactEmail: "",
      contactPhone: "",
      schoolType: undefined,
      activityCategory: "",
      plannedDate: "",
      plannedParticipants: "",
      message: "",
      activityInterest: activityTitle || "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    mutation.mutate(
      { data: {
        ...values,
        contactEmail: values.contactEmail || undefined,
        contactPhone: values.contactPhone || undefined,
      }},
      {
        onSuccess: () => {
          setOpen(false);
          form.reset();
          toast({
            title: eq.successTitle,
            description: eq.successDesc,
          });
        },
        onError: () => {
          toast({
            variant: "destructive",
            title: eq.errorTitle,
            description: eq.errorDesc,
          });
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button>{eq.titleShort}</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-background border-none shadow-2xl rounded-3xl p-0 overflow-hidden">
        <div className="bg-primary/5 p-6 border-b border-primary/10">
          <DialogHeader>
            <DialogTitle className="text-2xl font-display text-primary flex items-center gap-2">
              <Send className="w-5 h-5" />
              {eq.title}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-base">
              {activityTitle ? `${eq.descActivity}${activityTitle}` : eq.descDefault}
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <FormField
                  control={form.control}
                  name="schoolName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">{eq.orgName} *</FormLabel>
                      <FormControl>
                        <Input placeholder={eq.orgNamePlaceholder} className="rounded-xl bg-muted/50 border-border/50 focus-visible:ring-primary/20" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="schoolType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">{eq.orgType} *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="rounded-xl bg-muted/50 border-border/50">
                            <SelectValue placeholder={eq.orgTypePlaceholder} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="kindergarten">{eq.orgTypes.kindergarten}</SelectItem>
                          <SelectItem value="primary">{eq.orgTypes.primary}</SelectItem>
                          <SelectItem value="secondary">{eq.orgTypes.secondary}</SelectItem>
                          <SelectItem value="tertiary">{eq.orgTypes.tertiary}</SelectItem>
                          <SelectItem value="ngo">{eq.orgTypes.ngo}</SelectItem>
                          <SelectItem value="company">{eq.orgTypes.company}</SelectItem>
                          <SelectItem value="others">{eq.orgTypes.others}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="contactName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">{eq.contactName} *</FormLabel>
                    <FormControl>
                      <Input placeholder={eq.contactNamePlaceholder} className="rounded-xl bg-muted/50 border-border/50 focus-visible:ring-primary/20" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <p className="text-xs text-muted-foreground mb-3">
                  {lang === "zh" ? "聯絡方式（電話或電郵，二選一必填）" : "Contact method (phone or email — at least one required)"}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <FormField
                    control={form.control}
                    name="contactPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground">{eq.phone}</FormLabel>
                        <FormControl>
                          <Input placeholder={eq.phonePlaceholder} className="rounded-xl bg-muted/50 border-border/50 focus-visible:ring-primary/20" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="contactEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground">{eq.email}</FormLabel>
                        <FormControl>
                          <Input placeholder={eq.emailPlaceholder} type="email" className="rounded-xl bg-muted/50 border-border/50 focus-visible:ring-primary/20" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <FormField
                  control={form.control}
                  name="activityCategory"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">{eq.activityCategory}</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value ?? ""}>
                        <FormControl>
                          <SelectTrigger className="rounded-xl bg-muted/50 border-border/50">
                            <SelectValue placeholder={eq.activityCategoryPlaceholder} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(eq.activityCategories).map(([slug, label]) => (
                            <SelectItem key={slug} value={slug}>{label as string}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="plannedDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">{eq.plannedDate}</FormLabel>
                      <FormControl>
                        <Input placeholder={eq.plannedDatePlaceholder} className="rounded-xl bg-muted/50 border-border/50 focus-visible:ring-primary/20" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="plannedParticipants"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">{eq.plannedParticipants}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={eq.plannedParticipantsPlaceholder}
                        type="number"
                        min="1"
                        className="rounded-xl bg-muted/50 border-border/50 focus-visible:ring-primary/20"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">{eq.message} *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={eq.messagePlaceholder}
                        className="min-h-[100px] rounded-xl bg-muted/50 border-border/50 focus-visible:ring-primary/20 resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="pt-4 flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setOpen(false)} className="rounded-xl font-semibold border-border hover:bg-muted">
                  {eq.cancel}
                </Button>
                <Button type="submit" disabled={mutation.isPending} className="rounded-xl font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
                  {mutation.isPending ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> {eq.submitting}</>
                  ) : eq.submit}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
