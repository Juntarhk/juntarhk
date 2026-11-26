import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useSubmitEnquiryMutation } from "@/hooks/use-enquiries";
import { Loader2, Send, CheckCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { gtagEvent } from "@/lib/gtag";

interface InlineEnquiryFormProps {
  activityTitle?: string;
}

export function InlineEnquiryForm({ activityTitle }: InlineEnquiryFormProps) {
  const { t, lang } = useLanguage();
  const eq = t.enquiry;
  const mutation = useSubmitEnquiryMutation();
  const [submitted, setSubmitted] = useState(false);

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
    // Validate on blur so users see errors as they leave each field
    mode: "onBlur",
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
      {
        data: {
          ...values,
          contactEmail: values.contactEmail || undefined,
          contactPhone: values.contactPhone || undefined,
        },
      },
      {
        onSuccess: () => {
          gtagEvent("enquiry_form_submit", {
            interested_programme: values.activityInterest || values.activityCategory || "general",
          });
          setSubmitted(true);
          form.reset();
        },
        // On error, do NOT reset — preserve all field values so user can retry
        onError: () => {
          // Error toast is shown via the mutation's built-in error handling below
        },
      }
    );
  };

  // ── Inline success state ──────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="bg-white p-8 md:p-10 rounded-2xl shadow-xl border border-border flex flex-col items-center text-center py-16 gap-6">
        <div className="w-20 h-20 rounded-full bg-green-50 border-2 border-green-100 flex items-center justify-center">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>
        <div>
          <h3 className="text-xl font-extrabold text-[#1A3D4A] mb-2">{eq.successTitle}</h3>
          <p className="text-muted-foreground leading-relaxed max-w-sm">{eq.successDesc}</p>
        </div>
        <button
          onClick={() => setSubmitted(false)}
          className="text-sm text-primary underline underline-offset-4 hover:text-primary/80 transition-colors"
        >
          {lang === "zh" ? "提交另一個查詢" : "Submit another enquiry"}
        </button>
      </div>
    );
  }

  // ── Error banner (shown below submit if mutation failed) ──────────────────
  const showError = mutation.isError;

  return (
    <div className="bg-white p-8 md:p-10 rounded-2xl shadow-xl border border-border">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" noValidate>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* School / org name */}
            <FormField
              control={form.control}
              name="schoolName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="schoolName" className="text-foreground">{eq.orgName} *</FormLabel>
                  <FormControl>
                    <Input
                      id="schoolName"
                      placeholder={eq.orgNamePlaceholder}
                      autoComplete="organization"
                      className="rounded-xl bg-muted/50 border-border/50 focus-visible:ring-primary/20"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage role="alert" />
                </FormItem>
              )}
            />

            {/* School type */}
            <FormField
              control={form.control}
              name="schoolType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="schoolType" className="text-foreground">{eq.orgType} *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger id="schoolType" className="rounded-xl bg-muted/50 border-border/50">
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
                  <FormMessage role="alert" />
                </FormItem>
              )}
            />
          </div>

          {/* Contact name */}
          <FormField
            control={form.control}
            name="contactName"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="contactName" className="text-foreground">{eq.contactName} *</FormLabel>
                <FormControl>
                  <Input
                    id="contactName"
                    placeholder={eq.contactNamePlaceholder}
                    autoComplete="name"
                    className="rounded-xl bg-muted/50 border-border/50 focus-visible:ring-primary/20"
                    {...field}
                  />
                </FormControl>
                <FormMessage role="alert" />
              </FormItem>
            )}
          />

          {/* Contact method — phone OR email, at least one required */}
          <div>
            <p className="text-xs text-muted-foreground mb-3" id="contact-method-hint">
              {lang === "zh" ? "聯絡方式（電話或電郵，二選一必填）" : "Contact method (phone or email — at least one required)"}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FormField
                control={form.control}
                name="contactPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="contactPhone" className="text-foreground">{eq.phone}</FormLabel>
                    <FormControl>
                      <Input
                        id="contactPhone"
                        type="tel"
                        placeholder={eq.phonePlaceholder}
                        autoComplete="tel"
                        className="rounded-xl bg-muted/50 border-border/50 focus-visible:ring-primary/20"
                        aria-describedby="contact-method-hint"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage role="alert" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contactEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="contactEmail" className="text-foreground">{eq.email}</FormLabel>
                    <FormControl>
                      <Input
                        id="contactEmail"
                        type="email"
                        placeholder={eq.emailPlaceholder}
                        autoComplete="email"
                        className="rounded-xl bg-muted/50 border-border/50 focus-visible:ring-primary/20"
                        aria-describedby="contact-method-hint"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage role="alert" />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Activity category */}
            <FormField
              control={form.control}
              name="activityCategory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="activityCategory" className="text-foreground">{eq.activityCategory}</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value ?? ""}>
                    <FormControl>
                      <SelectTrigger id="activityCategory" className="rounded-xl bg-muted/50 border-border/50">
                        <SelectValue placeholder={eq.activityCategoryPlaceholder} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(eq.activityCategories).map(([slug, label]) => (
                        <SelectItem key={slug} value={slug}>{label as string}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage role="alert" />
                </FormItem>
              )}
            />

            {/* Planned date — free text to allow approximate dates e.g. "農曆新年前" */}
            <FormField
              control={form.control}
              name="plannedDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="plannedDate" className="text-foreground">{eq.plannedDate}</FormLabel>
                  <FormControl>
                    <Input
                      id="plannedDate"
                      type="text"
                      placeholder={eq.plannedDatePlaceholder}
                      autoComplete="off"
                      className="rounded-xl bg-muted/50 border-border/50 focus-visible:ring-primary/20"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage role="alert" />
                </FormItem>
              )}
            />
          </div>

          {/* Planned participants */}
          <FormField
            control={form.control}
            name="plannedParticipants"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="plannedParticipants" className="text-foreground">{eq.plannedParticipants}</FormLabel>
                <FormControl>
                  <Input
                    id="plannedParticipants"
                    type="number"
                    min="1"
                    max="5000"
                    placeholder={eq.plannedParticipantsPlaceholder}
                    className="rounded-xl bg-muted/50 border-border/50 focus-visible:ring-primary/20"
                    {...field}
                  />
                </FormControl>
                <FormMessage role="alert" />
              </FormItem>
            )}
          />

          {/* Message */}
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="message" className="text-foreground">{eq.message} *</FormLabel>
                <FormControl>
                  <Textarea
                    id="message"
                    placeholder={eq.messagePlaceholder}
                    className="min-h-[120px] rounded-xl bg-muted/50 border-border/50 focus-visible:ring-primary/20 resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage role="alert" />
              </FormItem>
            )}
          />

          {/* Error banner — shown on API failure; fields preserved */}
          {showError && (
            <div role="alert" className="bg-destructive/10 border border-destructive/30 text-destructive rounded-xl px-5 py-4 text-sm font-medium">
              {eq.errorTitle} — {eq.errorDesc}
            </div>
          )}

          <div className="pt-4">
            <Button
              type="submit"
              disabled={mutation.isPending}
              aria-disabled={mutation.isPending}
              className="w-full sm:w-auto px-10 h-14 rounded-full font-bold text-lg bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all group"
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" aria-hidden="true" />
                  <span>{eq.submitting}</span>
                </>
              ) : (
                <>
                  {eq.submit}
                  <Send className="w-5 h-5 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" aria-hidden="true" />
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
