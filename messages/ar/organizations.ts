export default {
  organizations: {
    metadata: {
      title: "المؤسسات",
      description: "المؤسسات التي أنت عضو فيها.",
    },
    badge: "المؤسسات",
    title: "المؤسسات",
    description:
      "المؤسسات التي أنت عضو فيها. تخضع الإجراءات هنا لدورك وصلاحياتك في كل منها.",
    toolbar: {
      searchPlaceholder: "ابحث بالاسم أو الرابط...",
      createOrganization: "إنشاء مؤسسة",
    },
    table: {
      columns: {
        organization: "المؤسسة",
        createdAt: "تاريخ الإنشاء",
        actions: "الإجراءات",
      },
      empty: "لا توجد مؤسسات تطابق بحثك.",
    },
    rowActions: {
      view: "عرض التفاصيل",
      remove: "حذف المؤسسة",
    },
    detail: {
      metadata: {
        title: "تفاصيل المؤسسة",
        description: "إدارة هذه المؤسسة.",
      },
      back: "العودة إلى المؤسسات",
      overview: {
        title: "نظرة عامة",
        createdAt: "أُنشئت في {date}",
        slug: "الرابط: /{slug}",
      },
      members: {
        title: "الأعضاء",
        description: "كل من لديه صلاحية الوصول إلى هذه المؤسسة.",
        empty: "لا يوجد أعضاء.",
      },
      danger: {
        title: "منطقة الخطر",
        description: "حذف هذه المؤسسة وجميع بياناتها نهائيًا.",
        submit: "حذف المؤسسة",
        success: "تم حذف المؤسسة.",
      },
    },
    removeDialog: {
      title: "حذف {name}",
      description:
        "سيؤدي هذا إلى حذف المؤسسة وجميع بياناتها نهائيًا — الأعضاء والدعوات والفرق. لا يمكن التراجع عن هذا.",
      submit: "حذف المؤسسة",
      success: "تم حذف المؤسسة.",
    },
  },
} as const
