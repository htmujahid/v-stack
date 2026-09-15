export default {
  organizations: {
    metadata: {
      title: "Organizations",
      description: "Organizations you belong to.",
    },
    badge: "Organizations",
    title: "Organizations",
    description:
      "Organizations you're a member of. Actions here follow your role and permissions in each one.",
    toolbar: {
      searchPlaceholder: "Search by name or URL...",
      createOrganization: "Create organization",
    },
    table: {
      columns: {
        organization: "Organization",
        createdAt: "Created",
        actions: "Actions",
      },
      empty: "No organizations match your search.",
    },
    rowActions: {
      view: "View details",
      remove: "Delete organization",
    },
    detail: {
      metadata: {
        title: "Organization details",
        description: "Manage this organization.",
      },
      back: "Back to organizations",
      overview: {
        title: "Overview",
        createdAt: "Created {date}",
        slug: "URL: /{slug}",
      },
      members: {
        title: "Members",
        description: "Everyone with access to this organization.",
        empty: "No members.",
      },
      danger: {
        title: "Danger zone",
        description: "Permanently delete this organization and all of its data.",
        submit: "Delete organization",
        success: "Organization deleted.",
      },
    },
    removeDialog: {
      title: "Delete {name}",
      description:
        "This permanently deletes the organization and all of its data — members, invitations, and teams. This cannot be undone.",
      submit: "Delete organization",
      success: "Organization deleted.",
    },
  },
} as const
