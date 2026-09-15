interface MetadataMessages {
  title: string
  description: string
}

interface LegalSectionMessages {
  title: string
  body: string
}

export interface CommonMessages {
  metadata: MetadataMessages
  localeSwitcher: {
    label: string
  }
  header: {
    home: string
    appHome: string
    signIn: string
    getStarted: string
    signOut: string
    profile: string
    dashboard: string
  }
  footer: {
    copyright: string
    status: string
    terms: string
    privacy: string
  }
  notFound: {
    title: string
    description: string
    homeLink: string
  }
  errorPage: {
    title: string
    description: string
    retry: string
    homeLink: string
    digest: string
  }
  app: {
    nav: {
      platform: string
      tasks: string
      reports: string
      analytics: string
      overview: string
      lifecycles: string
      projects: string
      labels: string
      resources: string
      settings: string
      help: string
      search: string
      apiKeys: string
    }
    dashboard: {
      metadata: MetadataMessages
      title: string
      description: string
      stats: Record<
        "customers" | "accounts" | "growth",
        {
          label: string
          note: string
          hint: string
        }
      >
      chart: {
        title: string
        description: string
        desktop: string
        mobile: string
        ranges: Record<"90d" | "30d" | "7d", string>
      }
      revenueChart: {
        title: string
        description: string
        revenue: string
      }
      table: {
        title: string
        description: string
        columns: Record<
          "order" | "customer" | "status" | "date" | "amount",
          string
        >
        status: Record<"paid" | "pending" | "refunded", string>
      }
    }
    home: {
      metadata: MetadataMessages
      badge: string
      title: string
      description: string
      account: {
        title: string
        name: string
        email: string
        emailStatus: string
        verified: string
        unverified: string
        createdAt: string
      }
    }
    profile: {
      metadata: MetadataMessages
      badge: string
      title: string
      description: string
      pages: Record<
        "general" | "security" | "sessions" | "danger",
        {
          title: string
          description: string
        }
      >
      avatar: {
        title: string
        description: string
        upload: string
        remove: string
        success: string
        removed: string
        invalidType: string
        tooLarge: string
      }
      name: {
        title: string
        description: string
        label: string
        submit: string
        success: string
      }
      username: {
        title: string
        description: string
        label: string
        submit: string
        success: string
      }
      email: {
        title: string
        description: string
        current: string
        verified: string
        unverified: string
        label: string
        submit: string
        success: string
      }
      password: {
        title: string
        description: string
        current: string
        new: string
        confirm: string
        submit: string
        success: string
        noPassword: string
        setPassword: string
      }
      twoFactor: {
        title: string
        description: string
        statusEnabled: string
        statusDisabled: string
        enabledHint: string
        disabledHint: string
        noPassword: string
        enable: string
        disable: string
        regenerate: string
        cancel: string
        continue: string
        password: string
        passwordHint: string
        enableTitle: string
        scanTitle: string
        scanDescription: string
        manualEntry: string
        verifyTitle: string
        verifyDescription: string
        verifySubmit: string
        codesTitle: string
        codesDescription: string
        copy: string
        copied: string
        download: string
        done: string
        enabledSuccess: string
        disableTitle: string
        disableDescription: string
        disabledSuccess: string
        regenerateTitle: string
        regenerateDescription: string
        regenerateSubmit: string
      }
      accounts: {
        title: string
        description: string
        credential: string
        connectedAt: string
        link: string
        unlink: string
        unlinked: string
      }
      sessions: {
        title: string
        description: string
        current: string
        unknownDevice: string
        createdAt: string
        revoke: string
        revoked: string
        revokeOthers: string
        revokedOthers: string
      }
      danger: {
        title: string
        description: string
        password: string
        submit: string
        success: string
      }
    }
    projects: {
      metadata: MetadataMessages
      title: string
      description: string
      create: string
      empty: string
      emptyHint: string
      status: Record<"active" | "archived", string>
      filters: {
        all: string
        active: string
        archived: string
      }
      card: {
        tasks: string
        viewTasks: string
        edit: string
        archive: string
        restore: string
        delete: string
        archived: string
        restored: string
      }
      form: {
        createTitle: string
        editTitle: string
        description: string
        name: string
        projectDescription: string
        color: string
        submit: string
        createSuccess: string
        updateSuccess: string
      }
      delete: {
        title: string
        description: string
        submit: string
        success: string
      }
    }
    tasks: {
      metadata: MetadataMessages
      title: string
      description: string
      create: string
      empty: string
      emptyHint: string
      status: Record<"todo" | "in_progress" | "done", string>
      priority: Record<"low" | "medium" | "high", string>
      filters: {
        allProjects: string
        noProject: string
        allStatuses: string
        searchPlaceholder: string
      }
      form: {
        createTitle: string
        editTitle: string
        description: string
        title: string
        taskDescription: string
        project: string
        noProject: string
        status: string
        priority: string
        dueDate: string
        labels: string
        newLabel: string
        labelName: string
        submit: string
        createSuccess: string
        updateSuccess: string
      }
      delete: {
        title: string
        description: string
        submit: string
        success: string
      }
      toggleSuccess: string
    }
    labels: {
      metadata: MetadataMessages
      title: string
      description: string
      create: string
      empty: string
      emptyHint: string
      delete: string
      deleteSuccess: string
      form: {
        createTitle: string
        description: string
        name: string
        color: string
        submit: string
        createSuccess: string
      }
    }
    announcementBanner: {
      dismiss: string
    }
    apiKeys: {
      metadata: MetadataMessages
      title: string
      description: string
      create: string
      empty: string
      emptyHint: string
      statusEnabled: string
      statusDisabled: string
      neverExpires: string
      expires: string
      expired: string
      neverUsed: string
      lastUsed: string
      noPermissions: string
      enable: string
      disable: string
      edit: string
      delete: string
      enableSuccess: string
      disableSuccess: string
      resources: Record<"projects" | "tasks" | "labels", string>
      permissionActions: Record<"create" | "read", string>
      form: {
        createTitle: string
        description: string
        name: string
        namePlaceholder: string
        expiration: string
        expirationOptions: Record<"none" | "30" | "90" | "365", string>
        permissions: string
        submit: string
        createSuccess: string
      }
      editForm: {
        editTitle: string
        description: string
        submit: string
        updateSuccess: string
      }
      createdDialog: {
        title: string
        description: string
        copy: string
        copied: string
        done: string
      }
      deleteDialog: {
        title: string
        description: string
        submit: string
        success: string
      }
    }
  }
}

export interface MarketingMessages {
  home: {
    badge: string
    title: string
    description: string
    getStarted: string
    seeHowItWorks: string
    note: string
    cards: Record<
      "roadmap" | "shipped" | "team",
      {
        title: string
        description: string
        badge: string
      }
    >
  }
  status: {
    metadata: MetadataMessages
    badge: string
    title: string
    description: string
    jsonApi: string
    overall: Record<"operational" | "degraded" | "outage", string>
    checkedAt: string
    table: {
      check: string
      latency: string
      status: string
    }
    latency: string
    badges: Record<"operational" | "degraded" | "outage", string>
    details: {
      version: string
      environment: string
      runtime: string
      uptime: string
    }
  }
  legal: {
    badge: string
    updated: string
  }
  terms: {
    metadata: MetadataMessages
    title: string
    description: string
    sections: Record<
      | "acceptance"
      | "use"
      | "accounts"
      | "billing"
      | "content"
      | "termination"
      | "liability"
      | "law"
      | "changes",
      LegalSectionMessages
    >
  }
  privacy: {
    metadata: MetadataMessages
    title: string
    description: string
    sections: Record<
      | "collection"
      | "use"
      | "sharing"
      | "cookies"
      | "retention"
      | "security"
      | "rights"
      | "children"
      | "changes",
      LegalSectionMessages
    >
  }
}

export interface AuthMessages {
  auth: {
    panel: {
      title: string
      description: string
    }
    nav: {
      signIn: string
      signUp: string
    }
    social: {
      continueWith: string
      separator: string
    }
    agreement: string
    errors: {
      default: string
    }
    signIn: {
      metadata: MetadataMessages
      title: string
      description: string
      tabs: {
        password: string
        magicLink: string
        otp: string
      }
      identifier: string
      email: string
      password: string
      forgotPassword: string
      submit: string
      success: string
    }
    magicLink: {
      description: string
      email: string
      send: string
      sent: string
      resend: string
      resendIn: string
      invalid: string
    }
    otpSignIn: {
      description: string
      email: string
      send: string
      sent: string
      verify: string
      changeEmail: string
      resend: string
      resendIn: string
    }
    signUp: {
      metadata: MetadataMessages
      title: string
      description: string
      name: string
      email: string
      password: string
      passwordDescription: string
      submit: string
      success: string
      disabled: {
        title: string
        description: string
        signIn: string
      }
    }
    forgotPassword: {
      metadata: MetadataMessages
      title: string
      description: string
      email: string
      submit: string
      success: string
    }
    resetPassword: {
      metadata: MetadataMessages
      title: string
      description: string
      password: string
      confirmPassword: string
      passwordDescription: string
      submit: string
      success: string
      invalidLink: string
    }
    twoFactor: {
      metadata: MetadataMessages
      title: string
      description: string
      tabs: {
        totp: string
        otp: string
        backup: string
      }
      totp: {
        description: string
      }
      otp: {
        description: string
        send: string
        resend: string
        resendIn: string
        sent: string
      }
      backup: {
        description: string
        label: string
      }
      trustDevice: string
      submit: string
      success: string
      backToSignIn: string
    }
    validation: {
      email: string
      identifier: string
      name: string
      username: string
      passwordRequired: string
      passwordMin: string
      passwordMismatch: string
      totpCode: string
      backupCode: string
      slug: string
    }
  }
}

export interface AdminMessages {
  admin: {
    nav: {
      users: string
      rolesAndPermissions: string
      announcements: string
      backToApp: string
    }
    overview: {
      metadata: MetadataMessages
      title: string
      description: string
      stats: Record<"total" | "active" | "admins" | "banned", { label: string }>
      recentUsers: {
        title: string
        description: string
        viewAll: string
        empty: string
      }
      usersCard: {
        title: string
        description: string
        action: string
      }
      rolesCard: {
        title: string
        description: string
        action: string
      }
    }
    users: {
      metadata: MetadataMessages
      title: string
      description: string
      stats: Record<"total" | "active" | "admins" | "banned", { label: string }>
    }
    roles: {
      metadata: MetadataMessages
      title: string
      description: string
      usersCount: string
      noPermissions: string
      resources: Record<"user" | "session" | "announcements", string>
      actions: Record<
        | "create"
        | "list"
        | "set-role"
        | "ban"
        | "impersonate"
        | "impersonate-admins"
        | "delete"
        | "set-password"
        | "set-email"
        | "get"
        | "update"
        | "revoke",
        string
      >
    }
    roleLabels: Record<"user" | "admin", string>
    toolbar: {
      searchPlaceholder: string
      filter: Record<
        "all" | "roleUser" | "roleAdmin" | "statusActive" | "statusBanned",
        string
      >
      createUser: string
      columns: string
    }
    table: {
      columns: Record<
        "user" | "role" | "status" | "createdAt" | "actions",
        string
      >
      you: string
      statusActive: string
      statusBanned: string
      empty: string
      selectAll: string
      selectRow: string
      selectionSummary: string
      previous: string
      next: string
    }
    pagination: {
      summary: string
    }
    rowActions: {
      view: string
      impersonate: string
      ban: string
      unban: string
      remove: string
    }
    createUser: {
      title: string
      description: string
      name: string
      email: string
      password: string
      role: string
      submit: string
      success: string
    }
    banDuration: Record<"permanent" | "1h" | "1d" | "7d" | "30d", string>
    banDialog: {
      title: string
      description: string
      reason: string
      reasonPlaceholder: string
      duration: string
      submit: string
      success: string
    }
    unbanSuccess: string
    removeDialog: {
      title: string
      description: string
      submit: string
      success: string
    }
    impersonateDialog: {
      title: string
      description: string
      submit: string
    }
    impersonation: {
      stop: string
    }
    detail: {
      metadata: MetadataMessages
      back: string
      self: string
      overview: {
        title: string
        memberSince: string
        verified: string
        unverified: string
      }
      role: {
        title: string
        description: string
        submit: string
        success: string
      }
      password: {
        title: string
        description: string
        label: string
        confirm: string
        submit: string
        success: string
      }
      ban: {
        title: string
        activeDescription: string
        reasonLabel: string
        expiresLabel: string
        permanent: string
        action: string
        unbanAction: string
      }
      sessions: {
        title: string
        description: string
        empty: string
        revoke: string
        revoked: string
        revokeAll: string
        revokedAll: string
        createdAt: string
      }
      danger: {
        title: string
        description: string
        submit: string
      }
    }
    announcements: {
      metadata: MetadataMessages
      title: string
      description: string
      create: string
      empty: string
      emptyHint: string
      inactive: string
      activate: string
      deactivate: string
      delete: string
      activateSuccess: string
      deactivateSuccess: string
      deleteSuccess: string
      level: Record<"info" | "warning" | "critical", string>
      form: {
        createTitle: string
        description: string
        title: string
        message: string
        level: string
        submit: string
        createSuccess: string
      }
    }
  }
}

export interface OrganizationsMessages {
  organizations: {
    metadata: MetadataMessages
    badge: string
    title: string
    description: string
    toolbar: {
      searchPlaceholder: string
      createOrganization: string
    }
    table: {
      columns: Record<"organization" | "createdAt" | "actions", string>
      empty: string
    }
    rowActions: {
      view: string
      remove: string
    }
    detail: {
      metadata: MetadataMessages
      back: string
      overview: {
        title: string
        createdAt: string
        slug: string
      }
      members: {
        title: string
        description: string
        empty: string
      }
      danger: {
        title: string
        description: string
        submit: string
        success: string
      }
    }
    removeDialog: {
      title: string
      description: string
      submit: string
      success: string
    }
  }
}

export interface OrganizationMessages {
  organization: {
    nav: {
      overview: string
      members: string
      teams: string
      roles: string
      settings: string
    }
    switcher: {
      title: string
      description: string
      searchPlaceholder: string
      organizationsHeading: string
      invitationsHeading: string
      noOrganizations: string
      noResults: string
      createOrganization: string
      accept: string
      decline: string
      accepted: string
      declined: string
    }
    createDialog: {
      title: string
      description: string
      name: string
      slug: string
      slugHint: string
      slugTaken: string
      slugReserved: string
      logo: string
      submit: string
      success: string
    }
    overview: {
      metadata: MetadataMessages
      title: string
      description: string
      stats: Record<
        "members" | "teams" | "pendingInvitations",
        { label: string }
      >
      quickLinks: {
        title: string
        members: string
        teams: string
        settings: string
      }
    }
    members: {
      metadata: MetadataMessages
      title: string
      description: string
      tabs: {
        members: string
        invitations: string
      }
      roleLabels: Record<"owner" | "admin" | "member", string>
      toolbar: {
        searchPlaceholder: string
        filter: Record<"all" | "roleOwner" | "roleAdmin" | "roleMember", string>
        invite: string
      }
      table: {
        columns: Record<"user" | "role" | "joined" | "actions", string>
        you: string
        empty: string
        selectAll: string
        selectRow: string
        selectionSummary: string
        previous: string
        next: string
      }
      rowActions: {
        changeRole: string
        remove: string
      }
      invite: {
        title: string
        description: string
        email: string
        role: string
        submit: string
        success: string
      }
      changeRole: {
        title: string
        description: string
        role: string
        submit: string
        success: string
      }
      remove: {
        title: string
        description: string
        submit: string
        success: string
      }
      invitations: {
        table: {
          columns: Record<
            "email" | "role" | "invitedBy" | "expires" | "actions",
            string
          >
          empty: string
        }
        rowActions: {
          cancel: string
        }
        cancelled: string
      }
    }
    teams: {
      metadata: MetadataMessages
      title: string
      description: string
      empty: string
      create: {
        title: string
        description: string
        name: string
        submit: string
        success: string
      }
      card: {
        members: string
      }
      detail: {
        metadata: MetadataMessages
        back: string
        rename: {
          title: string
          description: string
          name: string
          submit: string
          success: string
        }
        members: {
          title: string
          description: string
          empty: string
          add: string
          remove: string
        }
        addMember: {
          title: string
          description: string
          member: string
          submit: string
          success: string
        }
        danger: {
          title: string
          description: string
          submit: string
          success: string
        }
      }
    }
    roles: {
      metadata: MetadataMessages
      title: string
      description: string
      builtIn: {
        title: string
        description: string
      }
      custom: {
        title: string
        description: string
        empty: string
        emptyHint: string
        create: string
      }
      table: {
        columns: Record<"role" | "permissions" | "actions", string>
      }
      resources: Record<
        "organization" | "member" | "invitation" | "team" | "ac",
        string
      >
      actions: Record<
        "create" | "update" | "delete" | "cancel" | "read",
        string
      >
      form: {
        createTitle: string
        editTitle: string
        description: string
        name: string
        permissions: string
        submit: string
        createSuccess: string
        updateSuccess: string
      }
      delete: {
        title: string
        description: string
        submit: string
        success: string
      }
    }
    settings: {
      metadata: MetadataMessages
      title: string
      description: string
      general: {
        title: string
        description: string
        name: string
        slug: string
        slugTaken: string
        logo: string
        submit: string
        success: string
      }
      danger: {
        title: string
        description: string
        leave: {
          title: string
          description: string
          submit: string
          success: string
        }
        delete: {
          title: string
          description: string
          submit: string
          success: string
        }
      }
    }
    acceptInvitation: {
      metadata: MetadataMessages
      title: string
      invitedTo: string
      role: string
      emailMismatch: string
      notFound: string
      expired: string
      accept: string
      decline: string
      accepted: string
      declined: string
    }
  }
}

export interface Messages
  extends
    CommonMessages,
    MarketingMessages,
    AuthMessages,
    AdminMessages,
    OrganizationMessages,
    OrganizationsMessages {}
