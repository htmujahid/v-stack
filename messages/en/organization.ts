export default {
  organization: {
    nav: {
      overview: "Overview",
      members: "Members",
      teams: "Teams",
      roles: "Roles & permissions",
      settings: "Settings",
    },
    switcher: {
      title: "Switch organization",
      description: "Select an organization or create a new one.",
      searchPlaceholder: "Search organizations...",
      organizationsHeading: "Organizations",
      invitationsHeading: "Pending invitations",
      noOrganizations: "You're not part of any organization yet.",
      noResults: "No organizations match your search.",
      createOrganization: "Create organization",
      accept: "Accept",
      decline: "Decline",
      accepted: "Invitation accepted.",
      declined: "Invitation declined.",
    },
    createDialog: {
      title: "Create organization",
      description: "Set up a new workspace for your team.",
      name: "Name",
      slug: "URL",
      slugHint: "Your organization will be available at /{slug}",
      slugTaken: "This URL is already taken.",
      slugReserved: "This URL is reserved. Please choose another.",
      logo: "Logo",
      submit: "Create organization",
      success: "Organization created.",
    },
    overview: {
      metadata: {
        title: "Overview",
        description: "Your organization's workspace overview.",
      },
      title: "Overview",
      description: "A quick look at your organization.",
      stats: {
        members: { label: "Members" },
        teams: { label: "Teams" },
        pendingInvitations: { label: "Pending invitations" },
      },
      quickLinks: {
        title: "Quick links",
        members: "Manage members",
        teams: "Manage teams",
        settings: "Organization settings",
      },
    },
    members: {
      metadata: {
        title: "Members",
        description: "Manage who has access to this organization.",
      },
      title: "Members",
      description: "Invite people, manage roles, and control access.",
      tabs: {
        members: "Members",
        invitations: "Invitations",
      },
      roleLabels: {
        owner: "Owner",
        admin: "Admin",
        member: "Member",
      },
      toolbar: {
        searchPlaceholder: "Search by email...",
        filter: {
          all: "All roles",
          roleOwner: "Role: Owner",
          roleAdmin: "Role: Admin",
          roleMember: "Role: Member",
        },
        invite: "Invite member",
      },
      table: {
        columns: {
          user: "User",
          role: "Role",
          joined: "Joined",
          actions: "Actions",
        },
        you: "You",
        empty: "No members match your search or filters.",
        selectAll: "Select all",
        selectRow: "Select row",
        selectionSummary: "{selected} of {total} row(s) selected.",
        previous: "Previous",
        next: "Next",
      },
      rowActions: {
        changeRole: "Change role",
        remove: "Remove member",
      },
      invite: {
        title: "Invite member",
        description: "Send an email invitation to join this organization.",
        email: "Email",
        role: "Role",
        submit: "Send invitation",
        success: "Invitation sent.",
      },
      changeRole: {
        title: "Change role for {name}",
        description: "Controls what this member can access.",
        role: "Role",
        submit: "Save role",
        success: "Role updated.",
      },
      remove: {
        title: "Remove {name}",
        description:
          "They'll lose access to this organization immediately. This cannot be undone.",
        submit: "Remove member",
        success: "Member removed.",
      },
      invitations: {
        table: {
          columns: {
            email: "Email",
            role: "Role",
            invitedBy: "Invited by",
            expires: "Expires",
            actions: "Actions",
          },
          empty: "No pending invitations.",
        },
        rowActions: {
          cancel: "Cancel invitation",
        },
        cancelled: "Invitation cancelled.",
      },
    },
    teams: {
      metadata: {
        title: "Teams",
        description: "Organize members into teams.",
      },
      title: "Teams",
      description: "Group members into teams to manage access together.",
      empty: "No teams yet.",
      create: {
        title: "Create team",
        description: "Give your team a name.",
        name: "Name",
        submit: "Create team",
        success: "Team created.",
      },
      card: {
        members: "{count} members",
      },
      detail: {
        metadata: {
          title: "Team",
          description: "Manage this team.",
        },
        back: "Back to teams",
        rename: {
          title: "Team name",
          description: "Update this team's name.",
          name: "Name",
          submit: "Save",
          success: "Team updated.",
        },
        members: {
          title: "Members",
          description: "People on this team.",
          empty: "No members on this team yet.",
          add: "Add member",
          remove: "Remove",
        },
        addMember: {
          title: "Add team member",
          description: "Add an existing organization member to this team.",
          member: "Member",
          submit: "Add member",
          success: "Member added to team.",
        },
        danger: {
          title: "Danger zone",
          description: "Permanently delete this team.",
          submit: "Delete team",
          success: "Team deleted.",
        },
      },
    },
    roles: {
      metadata: {
        title: "Roles & permissions",
        description: "Manage custom roles for this organization.",
      },
      title: "Roles & permissions",
      description:
        "Owner, admin, and member are built in. Create custom roles for finer-grained access.",
      builtIn: {
        title: "Built-in roles",
        description: "These roles are predefined and can't be edited or removed.",
      },
      custom: {
        title: "Custom roles",
        description: "Roles created for this organization.",
        empty: "No custom roles yet.",
        emptyHint:
          "Create a role to grant a specific set of permissions to members who don't need the full access of owner, admin, or member.",
        create: "Create role",
      },
      table: {
        columns: {
          role: "Role",
          permissions: "Permissions",
          actions: "Actions",
        },
      },
      resources: {
        organization: "Organization",
        member: "Members",
        invitation: "Invitations",
        team: "Teams",
        ac: "Roles & permissions",
      },
      actions: {
        create: "Create",
        update: "Update",
        delete: "Delete",
        cancel: "Cancel",
        read: "Read",
      },
      form: {
        createTitle: "Create role",
        editTitle: "Edit role",
        description: "Choose a name and the permissions this role grants.",
        name: "Role name",
        permissions: "Permissions",
        submit: "Save role",
        createSuccess: "Role created.",
        updateSuccess: "Role updated.",
      },
      delete: {
        title: "Delete {name}",
        description:
          "This cannot be undone. Roles still assigned to members can't be deleted.",
        submit: "Delete role",
        success: "Role deleted.",
      },
    },
    settings: {
      metadata: {
        title: "Settings",
        description: "Manage your organization's settings.",
      },
      title: "Settings",
      description: "Manage your organization's profile and preferences.",
      general: {
        title: "General",
        description: "Basic information about your organization.",
        name: "Name",
        slug: "URL",
        slugTaken: "This URL is already taken.",
        logo: "Logo",
        submit: "Save changes",
        success: "Organization updated.",
      },
      danger: {
        title: "Danger zone",
        description: "Irreversible actions for this organization.",
        leave: {
          title: "Leave organization",
          description:
            "You'll lose access to this organization. The sole owner can't leave.",
          submit: "Leave organization",
          success: "You left the organization.",
        },
        delete: {
          title: "Delete organization",
          description:
            "Permanently delete this organization and all of its data. This cannot be undone.",
          submit: "Delete organization",
          success: "Organization deleted.",
        },
      },
    },
    acceptInvitation: {
      metadata: {
        title: "Accept invitation",
        description: "You've been invited to join an organization.",
      },
      title: "You've been invited",
      invitedTo: "You've been invited to join {name}.",
      role: "Role: {role}",
      emailMismatch:
        "This invitation was sent to a different email address than the one you're signed in with.",
      notFound: "This invitation doesn't exist or has already been used.",
      expired: "This invitation has expired.",
      accept: "Accept invitation",
      decline: "Decline",
      accepted: "Invitation accepted.",
      declined: "Invitation declined.",
    },
  },
} as const
