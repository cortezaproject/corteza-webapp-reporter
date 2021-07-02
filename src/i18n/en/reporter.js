/* eslint-disable no-template-curly-in-string */
export default {
  navigation: {
    help: {
      forum: 'Help',
      documentation: 'Documentation',
      feedback: 'Send feedback',
      version: 'Version:',
    },
    userSettings: {
      loggedInAs: 'Logged in as {{user}}',
      profile: 'Profile',
      changePassword: 'Change password',
      logout: 'Logout',
    },
  },

  list: {
    title: 'Reports',
    untitledTitle: 'Untitled report',

    searchPlaceholder: 'Type here to search reports',
  },
  edit: {
    title: 'Edit report',
  },
  create: {
    title: 'Create report',
  },

  general: {
    label: {
      back: 'Back',
      delete: 'Delete',
      save: 'Save',
      add: '+ Add',
    },
  },

  permission: {
    saveChanges: 'Save changes',
    resetBack: 'Reset back to "{{current}}"',
    setFor: 'Set permissions for {{target}}',
    report: {
      all: 'all reports',
      specific: 'report "{{target}}"',
    },
    'system-report': {
      read: {
        title: 'Read any report',
        specific: 'Read report "{{target}}"',
        description: '',
      },
      update: {
        title: 'Update any report',
        specific: 'Update report "{{target}}"',
        description: '',
      },
      delete: {
        title: 'Delete any report',
        specific: 'Delete report "{{target}}"',
        description: '',
      },
      run: {
        title: 'Run any report',
        specific: 'Run report "{{target}}"',
        description: '',
      },
    },
  },

  notification: {
    general: {
      success: 'Success',
      error: 'Error',
      warning: 'Warning',
    },

    report: {
      listFetchFailed: 'Failed to fetch reports',
      fetchFailed: 'Failed to fetch report',
      createFailed: 'Failed to create report',
      updateFailed: 'Failed to update report',
      deleteFailed: 'Failed to delete report',

      updated: 'Report updated',
      created: 'Report created',
      delete: 'Report deleted',
    },
  },
}
