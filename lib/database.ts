import { getSupabaseClient, isSupabaseConfigured } from './supabase'

// Types for our database entities
export interface UserProfile {
  id: string
  clerk_user_id: string
  full_name?: string
  email?: string
  phone?: string
  avatar_url?: string
  timezone?: string
  language?: string
  currency?: string
  date_format?: string
  theme?: string
  created_at?: string
  updated_at?: string
}

export interface CustomRole {
  id: string
  organization_id: string
  name: string
  description?: string
  permissions: {
    dashboard: { read: boolean; write: boolean; delete: boolean }
    analytics: { read: boolean; write: boolean; delete: boolean }
    projects: { read: boolean; write: boolean; delete: boolean }
    finances: { read: boolean; write: boolean; delete: boolean }
    settings: { read: boolean; write: boolean; delete: boolean }
  }
  is_system?: boolean
  color?: string
  created_by?: string
  created_at?: string
  updated_at?: string
}

export interface Organization {
  id: string
  name: string
  description?: string
  industry?: string
  logo_url?: string
  website?: string
  phone?: string
  email?: string
  address?: any
  tax_id?: string
  currency?: string
  timezone?: string
  created_by?: string
  created_at?: string
  updated_at?: string
}

export interface Account {
  id: string
  organization_id: string
  account_type_id: string
  name: string
  account_number?: string
  bank_name?: string
  balance: number
  currency?: string
  is_active?: boolean
  description?: string
  created_by?: string
  created_at?: string
  updated_at?: string
}

export interface Transaction {
  id: string
  organization_id: string
  account_id: string
  category_id?: string
  type: 'income' | 'expense' | 'transfer'
  amount: number
  description?: string
  reference_number?: string
  transaction_date: string
  status?: 'pending' | 'completed' | 'cancelled'
  tags?: string[]
  metadata?: any
  created_by?: string
  created_at?: string
  updated_at?: string
}

export interface Project {
  id: string
  organization_id: string
  name: string
  description?: string
  status?: 'active' | 'completed' | 'on_hold' | 'cancelled'
  budget?: number
  spent?: number
  start_date?: string
  end_date?: string
  project_manager_id?: string
  department_id?: string
  priority?: 'low' | 'medium' | 'high' | 'urgent'
  created_by?: string
  created_at?: string
  updated_at?: string
}

export interface Invoice {
  id: string
  organization_id: string
  invoice_number: string
  client_name: string
  client_email?: string
  client_address?: any
  subtotal: number
  tax_rate?: number
  tax_amount?: number
  total_amount: number
  currency?: string
  status?: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
  issue_date: string
  due_date: string
  paid_date?: string
  notes?: string
  terms?: string
  project_id?: string
  created_by?: string
  created_at?: string
  updated_at?: string
}

export interface Payment {
  id: string
  organization_id: string
  invoice_id?: string
  account_id?: string
  amount: number
  payment_method?: string
  reference_number?: string
  payment_date: string
  status?: 'pending' | 'completed' | 'failed'
  notes?: string
  created_by?: string
  created_at?: string
  updated_at?: string
}

export interface Meeting {
  id: string
  organization_id: string
  title: string
  description?: string
  meeting_date: string
  duration_minutes?: number
  location?: string
  meeting_url?: string
  type?: 'general' | 'project' | 'financial' | 'board'
  status?: 'scheduled' | 'completed' | 'cancelled'
  project_id?: string
  organizer_id?: string
  agenda?: any[]
  notes?: string
  created_at?: string
  updated_at?: string
}

// Database service class
export class DatabaseService {
  // Lazy initialization of Supabase client
  private getClient() {
    return getSupabaseClient()
  }

  // Check if database is available
  isAvailable(): boolean {
    return isSupabaseConfigured()
  }

  // Expose Supabase client for advanced operations
  getSupabaseClient() {
    return this.getClient()
  }

  // User Profile Operations
  async createUserProfile(data: Partial<UserProfile>): Promise<{ data: UserProfile | null, error: any }> {
    if (!this.isAvailable()) {
      return { data: null, error: { message: 'Database not configured' } }
    }

    const { data: result, error } = await this.getClient()
      .from('user_profiles')
      .insert(data)
      .select()
      .single()

    return { data: result, error }
  }

  async getUserProfile(clerkUserId: string): Promise<{ data: UserProfile | null, error: any }> {
    if (!this.isAvailable()) {
      return { data: null, error: { message: 'Database not configured' } }
    }

    const { data, error } = await this.getClient()
      .from('user_profiles')
      .select('*')
      .eq('clerk_user_id', clerkUserId)
      .single()

    return { data, error }
  }

  async updateUserProfile(id: string, updates: Partial<UserProfile>): Promise<{ data: UserProfile | null, error: any }> {
    if (!this.isAvailable()) {
      return { data: null, error: { message: 'Database not configured' } }
    }

    const { data, error } = await this.getClient()
      .from('user_profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    return { data, error }
  }

  // Organization Operations
  async createOrganization(data: Partial<Organization>): Promise<{ data: Organization | null, error: any }> {
    if (!this.isAvailable()) {
      return { data: null, error: { message: 'Database not configured' } }
    }

    const { data: result, error } = await this.getClient()
      .from('organizations')
      .insert(data)
      .select()
      .single()

    return { data: result, error }
  }

  async getOrganizations(): Promise<{ data: Organization[], error: any }> {
    if (!this.isAvailable()) {
      return { data: [], error: { message: 'Database not configured' } }
    }

    const { data, error } = await this.getClient()
      .from('organizations')
      .select('*')
      .order('created_at', { ascending: false })

    return { data: data || [], error }
  }

  async updateOrganization(id: string, updates: Partial<Organization>): Promise<{ data: Organization | null, error: any }> {
    if (!this.isAvailable()) {
      return { data: null, error: { message: 'Database not configured' } }
    }

    const { data, error } = await this.getClient()
      .from('organizations')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    return { data, error }
  }

  // Account Operations
  async createAccount(data: Partial<Account>): Promise<{ data: Account | null, error: any }> {
    if (!this.isAvailable()) {
      return { data: null, error: { message: 'Database not configured' } }
    }

    const { data: result, error } = await this.getClient()
      .from('accounts')
      .insert(data)
      .select()
      .single()

    return { data: result, error }
  }

  async getAccounts(organizationId: string): Promise<{ data: Account[], error: any }> {
    if (!this.isAvailable()) {
      return { data: [], error: { message: 'Database not configured' } }
    }

    const { data, error } = await this.getClient()
      .from('accounts')
      .select('*, account_types(name, category, icon)')
      .eq('organization_id', organizationId)
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    return { data: data || [], error }
  }

  async updateAccountBalance(id: string, newBalance: number): Promise<{ data: Account | null, error: any }> {
    if (!this.isAvailable()) {
      return { data: null, error: { message: 'Database not configured' } }
    }

    const { data, error } = await this.getClient()
      .from('accounts')
      .update({ balance: newBalance })
      .eq('id', id)
      .select()
      .single()

    return { data, error }
  }

  // Transaction Operations
  async createTransaction(data: Partial<Transaction>): Promise<{ data: Transaction | null, error: any }> {
    if (!this.isAvailable()) {
      return { data: null, error: { message: 'Database not configured' } }
    }

    const { data: result, error } = await this.getClient()
      .from('transactions')
      .insert(data)
      .select()
      .single()

    return { data: result, error }
  }

  async getTransactions(organizationId: string, limit = 50): Promise<{ data: Transaction[], error: any }> {
    if (!this.isAvailable()) {
      return { data: [], error: { message: 'Database not configured' } }
    }

    const { data, error } = await this.getClient()
      .from('transactions')
      .select(`
        *,
        accounts(name, account_number),
        transaction_categories(name, type, color, icon)
      `)
      .eq('organization_id', organizationId)
      .order('transaction_date', { ascending: false })
      .limit(limit)

    return { data: data || [], error }
  }

  async getRecentTransactions(organizationId: string, limit = 10): Promise<{ data: Transaction[], error: any }> {
    return this.getTransactions(organizationId, limit)
  }

  // Project Operations
  async createProject(data: Partial<Project>): Promise<{ data: Project | null, error: any }> {
    if (!this.isAvailable()) {
      return { data: null, error: { message: 'Database not configured' } }
    }

    const { data: result, error } = await this.getClient()
      .from('projects')
      .insert(data)
      .select()
      .single()

    return { data: result, error }
  }

  async getProjects(organizationId: string): Promise<{ data: Project[], error: any }> {
    if (!this.isAvailable()) {
      return { data: [], error: { message: 'Database not configured' } }
    }

    const { data, error } = await this.getClient()
      .from('projects')
      .select('*')
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false })

    return { data: data || [], error }
  }

  async updateProject(id: string, updates: Partial<Project>): Promise<{ data: Project | null, error: any }> {
    if (!this.isAvailable()) {
      return { data: null, error: { message: 'Database not configured' } }
    }

    const { data, error } = await this.getClient()
      .from('projects')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    return { data, error }
  }

  // Invoice Operations
  async createInvoice(data: Partial<Invoice>): Promise<{ data: Invoice | null, error: any }> {
    if (!this.isAvailable()) {
      return { data: null, error: { message: 'Database not configured' } }
    }

    const { data: result, error } = await this.getClient()
      .from('invoices')
      .insert(data)
      .select()
      .single()

    return { data: result, error }
  }

  async getInvoices(organizationId: string): Promise<{ data: Invoice[], error: any }> {
    if (!this.isAvailable()) {
      return { data: [], error: { message: 'Database not configured' } }
    }

    const { data, error } = await this.getClient()
      .from('invoices')
      .select('*')
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false })

    return { data: data || [], error }
  }

  async updateInvoiceStatus(id: string, status: string): Promise<{ data: Invoice | null, error: any }> {
    if (!this.isAvailable()) {
      return { data: null, error: { message: 'Database not configured' } }
    }

    const { data, error } = await this.getClient()
      .from('invoices')
      .update({ status })
      .eq('id', id)
      .select()
      .single()

    return { data, error }
  }

  // Payment Operations
  async createPayment(data: Partial<Payment>): Promise<{ data: Payment | null, error: any }> {
    if (!this.isAvailable()) {
      return { data: null, error: { message: 'Database not configured' } }
    }

    const { data: result, error } = await this.getClient()
      .from('payments')
      .insert(data)
      .select()
      .single()

    return { data: result, error }
  }

  async getPayments(organizationId: string): Promise<{ data: Payment[], error: any }> {
    if (!this.isAvailable()) {
      return { data: [], error: { message: 'Database not configured' } }
    }

    const { data, error } = await this.getClient()
      .from('payments')
      .select('*')
      .eq('organization_id', organizationId)
      .order('payment_date', { ascending: false })

    return { data: data || [], error }
  }

  // Meeting Operations
  async createMeeting(data: Partial<Meeting>): Promise<{ data: Meeting | null, error: any }> {
    if (!this.isAvailable()) {
      return { data: null, error: { message: 'Database not configured' } }
    }

    const { data: result, error } = await this.getClient()
      .from('meetings')
      .insert(data)
      .select()
      .single()

    return { data: result, error }
  }

  async getMeetings(organizationId: string): Promise<{ data: Meeting[], error: any }> {
    if (!this.isAvailable()) {
      return { data: [], error: { message: 'Database not configured' } }
    }

    const { data, error } = await this.getClient()
      .from('meetings')
      .select('*')
      .eq('organization_id', organizationId)
      .order('meeting_date', { ascending: false })

    return { data: data || [], error }
  }

  async getUpcomingMeetings(organizationId: string, limit = 5): Promise<{ data: Meeting[], error: any }> {
    if (!this.isAvailable()) {
      return { data: [], error: { message: 'Database not configured' } }
    }

    const { data, error } = await this.getClient()
      .from('meetings')
      .select('*')
      .eq('organization_id', organizationId)
      .eq('status', 'scheduled')
      .gte('meeting_date', new Date().toISOString())
      .order('meeting_date', { ascending: true })
      .limit(limit)

    return { data: data || [], error }
  }

  // Utility Operations
  async getAccountTypes(): Promise<{ data: any[], error: any }> {
    if (!this.isAvailable()) {
      return { data: [], error: { message: 'Database not configured' } }
    }

    const { data, error } = await this.getClient()
      .from('account_types')
      .select('*')
      .order('name')

    return { data: data || [], error }
  }

  async getTransactionCategories(organizationId?: string): Promise<{ data: any[], error: any }> {
    if (!this.isAvailable()) {
      return { data: [], error: { message: 'Database not configured' } }
    }

    let query = this.getClient()
      .from('transaction_categories')
      .select('*')

    if (organizationId) {
      query = query.or(`organization_id.eq.${organizationId},is_system.eq.true`)
    } else {
      query = query.eq('is_system', true)
    }

    const { data, error } = await query.order('type').order('name')

    return { data: data || [], error }
  }

  // Analytics helpers
  async getAccountBalanceTotal(organizationId: string): Promise<{ data: number, error: any }> {
    if (!this.isAvailable()) {
      return { data: 0, error: { message: 'Database not configured' } }
    }

    const { data, error } = await this.getClient()
      .from('accounts')
      .select('balance')
      .eq('organization_id', organizationId)
      .eq('is_active', true)

    if (error) return { data: 0, error }

    const total = data?.reduce((sum, account) => sum + (account.balance || 0), 0) || 0
    return { data: total, error: null }
  }

  async getTransactionSummary(organizationId: string, startDate?: string, endDate?: string) {
    if (!this.isAvailable()) {
      return { data: null, error: { message: 'Database not configured' } }
    }

    let query = this.getClient()
      .from('transactions')
      .select('type, amount')
      .eq('organization_id', organizationId)
      .eq('status', 'completed')

    if (startDate) query = query.gte('transaction_date', startDate)
    if (endDate) query = query.lte('transaction_date', endDate)

    const { data, error } = await query

    if (error) return { data: null, error }

    const summary = data?.reduce((acc, transaction) => {
      if (transaction.type === 'income') {
        acc.income += transaction.amount
      } else if (transaction.type === 'expense') {
        acc.expenses += transaction.amount
      }
      return acc
    }, { income: 0, expenses: 0 }) || { income: 0, expenses: 0 }

    return { 
      data: {
        ...summary,
        netIncome: summary.income - summary.expenses
      }, 
      error: null 
    }
  }

  // Context-aware methods that automatically use current organization
  async getContextualAccounts(): Promise<{ data: Account[], error: any }> {
    // This will be called from components that have access to the current organization
    // For now, return empty array - components should pass organizationId explicitly
    return { data: [], error: { message: 'Organization ID required' } }
  }

  async getContextualTransactions(limit = 50): Promise<{ data: Transaction[], error: any }> {
    // This will be called from components that have access to the current organization
    // For now, return empty array - components should pass organizationId explicitly
    return { data: [], error: { message: 'Organization ID required' } }
  }

  async getContextualProjects(): Promise<{ data: Project[], error: any }> {
    // This will be called from components that have access to the current organization
    // For now, return empty array - components should pass organizationId explicitly
    return { data: [], error: { message: 'Organization ID required' } }
  }

  // Role Management Functions
  async getCustomRoles(organizationId: string): Promise<{ data: CustomRole[] | null, error: any }> {
    if (!isSupabaseConfigured()) {
      return { data: null, error: { message: 'Database not configured' } }
    }

    try {
      const supabase = getSupabaseClient()
      const { data, error } = await supabase
        .from('custom_roles')
        .select('*')
        .eq('organization_id', organizationId)
        .order('created_at', { ascending: true })

      return { data, error }
    } catch (error) {
      console.error('Error fetching custom roles:', error)
      return { data: null, error }
    }
  }

  async createCustomRole(organizationId: string, roleData: Omit<CustomRole, 'id' | 'organization_id' | 'created_at' | 'updated_at'>): Promise<{ data: CustomRole | null, error: any }> {
    if (!isSupabaseConfigured()) {
      return { data: null, error: { message: 'Database not configured' } }
    }

    try {
      const supabase = getSupabaseClient()
      const { data, error } = await supabase
        .from('custom_roles')
        .insert([{
          organization_id: organizationId,
          ...roleData
        }])
        .select()
        .single()

      return { data, error }
    } catch (error) {
      console.error('Error creating custom role:', error)
      return { data: null, error }
    }
  }

  async updateCustomRole(roleId: string, updates: Partial<CustomRole>): Promise<{ data: CustomRole | null, error: any }> {
    if (!isSupabaseConfigured()) {
      return { data: null, error: { message: 'Database not configured' } }
    }

    try {
      const supabase = getSupabaseClient()
      const { data, error } = await supabase
        .from('custom_roles')
        .update(updates)
        .eq('id', roleId)
        .select()
        .single()

      return { data, error }
    } catch (error) {
      console.error('Error updating custom role:', error)
      return { data: null, error }
    }
  }

  async deleteCustomRole(roleId: string): Promise<{ data: any, error: any }> {
    if (!isSupabaseConfigured()) {
      return { data: null, error: { message: 'Database not configured' } }
    }

    try {
      const supabase = getSupabaseClient()
      const { data, error } = await supabase
        .from('custom_roles')
        .delete()
        .eq('id', roleId)
        .eq('is_system', false) // Prevent deletion of system roles

      return { data, error }
    } catch (error) {
      console.error('Error deleting custom role:', error)
      return { data: null, error }
    }
  }

  async assignRoleToMember(memberId: string, roleId: string): Promise<{ data: any, error: any }> {
    if (!isSupabaseConfigured()) {
      return { data: null, error: { message: 'Database not configured' } }
    }

    try {
      const supabase = getSupabaseClient()
      const { data, error } = await supabase
        .from('organization_members')
        .update({ custom_role_id: roleId })
        .eq('id', memberId)
        .select()

      return { data, error }
    } catch (error) {
      console.error('Error assigning role to member:', error)
      return { data: null, error }
    }
  }

  async getOrganizationMembersWithRoles(organizationId: string): Promise<{ data: any[] | null, error: any }> {
    if (!isSupabaseConfigured()) {
      return { data: null, error: { message: 'Database not configured' } }
    }

    try {
      const supabase = getSupabaseClient()
      const { data, error } = await supabase
        .from('organization_members')
        .select(`
          *,
          user_profiles(full_name, email, avatar_url),
          custom_roles(name, permissions, color)
        `)
        .eq('organization_id', organizationId)

      return { data, error }
    } catch (error) {
      console.error('Error fetching organization members with roles:', error)
      return { data: null, error }
    }
  }
}

// Export a lazy singleton instance to avoid initialization issues
let _db: DatabaseService | null = null
export function getDatabase(): DatabaseService {
  if (_db === null) {
    _db = new DatabaseService()
  }
  return _db
}

// Create a Proxy for backwards compatibility that lazily initializes
export const db = new Proxy({} as DatabaseService, {
  get(target, prop) {
    const instance = getDatabase()
    const value = (instance as any)[prop]
    return typeof value === 'function' ? value.bind(instance) : value
  }
}) 