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

export interface Department {
  id: string
  organization_id: string
  name: string
  description?: string
  head_user_id?: string
  budget?: number
  created_at?: string
  updated_at?: string
}

export interface Notification {
  id: string
  user_id: string
  organization_id: string
  title: string
  message: string
  type?: 'info' | 'warning' | 'error' | 'success'
  category?: string
  is_read?: boolean
  action_url?: string
  metadata?: any
  created_at?: string
}

export interface Investment {
  id: string
  organization_id: string
  name: string
  type: 'stocks' | 'bonds' | 'real_estate' | 'crypto' | 'business'
  description?: string
  initial_investment: number
  current_value?: number
  expected_return?: number
  risk_level?: 'low' | 'medium' | 'high'
  investment_date: string
  maturity_date?: string
  status?: 'active' | 'sold' | 'matured'
  account_id?: string
  created_by?: string
  created_at?: string
  updated_at?: string
}

export interface BudgetGoal {
  id: string
  organization_id: string
  name: string
  description?: string
  target_amount: number
  current_amount?: number
  target_date?: string
  category_id?: string
  is_active?: boolean
  created_by?: string
  created_at?: string
  updated_at?: string
}

export interface MeetingAttendee {
  id: string
  meeting_id: string
  user_id: string
  status?: 'invited' | 'accepted' | 'declined' | 'attended'
  response_date?: string
}

export interface AuditLog {
  id: string
  organization_id: string
  user_id?: string
  action: string
  table_name: string
  record_id?: string
  old_values?: any
  new_values?: any
  ip_address?: string
  user_agent?: string
  created_at?: string
}

export interface ChatChannel {
  id: string
  organization_id: string
  name: string
  description?: string
  type: 'public' | 'private' | 'direct' | 'group'
  is_archived?: boolean
  project_id?: string
  created_by?: string
  created_at?: string
  updated_at?: string
}

export interface ChatMessage {
  id: string
  channel_id: string
  user_id: string
  content: string
  message_type?: 'text' | 'image' | 'file' | 'system'
  reply_to_id?: string
  metadata?: any
  is_edited?: boolean
  is_deleted?: boolean
  created_at?: string
  updated_at?: string
}

export interface ChatChannelMember {
  id: string
  channel_id: string
  user_id: string
  role?: 'admin' | 'member'
  joined_at?: string
  last_read_at?: string
  is_muted?: boolean
}

export interface ChatMessageReaction {
  id: string
  message_id: string
  user_id: string
  reaction: string
  created_at?: string
}

export interface ChatAttachment {
  id: string
  message_id: string
  file_name: string
  file_type?: string
  file_size?: number
  file_url: string
  thumbnail_url?: string
  created_at?: string
}

export interface ChatMention {
  id: string
  message_id: string
  user_id: string
  mention_type?: 'user' | 'channel' | 'everyone'
  is_read?: boolean
  created_at?: string
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

  // Department Operations
  async createDepartment(data: Partial<Department>): Promise<{ data: Department | null, error: any }> {
    if (!this.isAvailable()) {
      return { data: null, error: { message: 'Database not configured' } }
    }

    const { data: result, error } = await this.getClient()
      .from('departments')
      .insert(data)
      .select()
      .single()

    return { data: result, error }
  }

  async getDepartments(organizationId: string): Promise<{ data: Department[], error: any }> {
    if (!this.isAvailable()) {
      return { data: [], error: { message: 'Database not configured' } }
    }

    const { data, error } = await this.getClient()
      .from('departments')
      .select(`
        *,
        user_profiles(full_name, email)
      `)
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false })

    return { data: data || [], error }
  }

  async getDepartment(id: string): Promise<{ data: Department | null, error: any }> {
    if (!this.isAvailable()) {
      return { data: null, error: { message: 'Database not configured' } }
    }

    const { data, error } = await this.getClient()
      .from('departments')
      .select(`
        *,
        user_profiles(full_name, email)
      `)
      .eq('id', id)
      .single()

    return { data, error }
  }

  async updateDepartment(id: string, updates: Partial<Department>): Promise<{ data: Department | null, error: any }> {
    if (!this.isAvailable()) {
      return { data: null, error: { message: 'Database not configured' } }
    }

    const { data, error } = await this.getClient()
      .from('departments')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    return { data, error }
  }

  async deleteDepartment(id: string): Promise<{ data: any, error: any }> {
    if (!this.isAvailable()) {
      return { data: null, error: { message: 'Database not configured' } }
    }

    const { data, error } = await this.getClient()
      .from('departments')
      .delete()
      .eq('id', id)

    return { data, error }
  }

  // Notification Operations
  async createNotification(data: Partial<Notification>): Promise<{ data: Notification | null, error: any }> {
    if (!this.isAvailable()) {
      return { data: null, error: { message: 'Database not configured' } }
    }

    const { data: result, error } = await this.getClient()
      .from('notifications')
      .insert(data)
      .select()
      .single()

    return { data: result, error }
  }

  async getNotifications(userId: string, organizationId: string, limit = 50): Promise<{ data: Notification[], error: any }> {
    if (!this.isAvailable()) {
      return { data: [], error: { message: 'Database not configured' } }
    }

    const { data, error } = await this.getClient()
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false })
      .limit(limit)

    return { data: data || [], error }
  }

  async markNotificationAsRead(notificationId: string): Promise<{ data: Notification | null, error: any }> {
    if (!this.isAvailable()) {
      return { data: null, error: { message: 'Database not configured' } }
    }

    const { data, error } = await this.getClient()
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId)
      .select()
      .single()

    return { data, error }
  }

  async deleteNotification(notificationId: string): Promise<{ data: any, error: any }> {
    if (!this.isAvailable()) {
      return { data: null, error: { message: 'Database not configured' } }
    }

    const { data, error } = await this.getClient()
      .from('notifications')
      .delete()
      .eq('id', notificationId)

    return { data, error }
  }

  async getUnreadNotificationCount(userId: string, organizationId: string): Promise<{ data: number, error: any }> {
    if (!this.isAvailable()) {
      return { data: 0, error: { message: 'Database not configured' } }
    }

    const { count, error } = await this.getClient()
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('organization_id', organizationId)
      .eq('is_read', false)

    return { data: count || 0, error }
  }

  // Investment Operations
  async createInvestment(data: Partial<Investment>): Promise<{ data: Investment | null, error: any }> {
    if (!this.isAvailable()) {
      return { data: null, error: { message: 'Database not configured' } }
    }

    const { data: result, error } = await this.getClient()
      .from('investments')
      .insert(data)
      .select()
      .single()

    return { data: result, error }
  }

  async getInvestments(organizationId: string): Promise<{ data: Investment[], error: any }> {
    if (!this.isAvailable()) {
      return { data: [], error: { message: 'Database not configured' } }
    }

    const { data, error } = await this.getClient()
      .from('investments')
      .select(`
        *,
        accounts(name, account_number)
      `)
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false })

    return { data: data || [], error }
  }

  async updateInvestment(id: string, updates: Partial<Investment>): Promise<{ data: Investment | null, error: any }> {
    if (!this.isAvailable()) {
      return { data: null, error: { message: 'Database not configured' } }
    }

    const { data, error } = await this.getClient()
      .from('investments')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    return { data, error }
  }

  async deleteInvestment(id: string): Promise<{ data: any, error: any }> {
    if (!this.isAvailable()) {
      return { data: null, error: { message: 'Database not configured' } }
    }

    const { data, error } = await this.getClient()
      .from('investments')
      .delete()
      .eq('id', id)

    return { data, error }
  }

  async getInvestmentPerformance(organizationId: string): Promise<{ data: any, error: any }> {
    if (!this.isAvailable()) {
      return { data: null, error: { message: 'Database not configured' } }
    }

    const { data, error } = await this.getClient()
      .from('investments')
      .select('initial_investment, current_value, type, status')
      .eq('organization_id', organizationId)

    if (error) return { data: null, error }

    const totalInvestment = data?.reduce((sum, inv) => sum + (inv.initial_investment || 0), 0) || 0
    const totalCurrentValue = data?.reduce((sum, inv) => sum + (inv.current_value || inv.initial_investment || 0), 0) || 0
    const totalReturn = totalCurrentValue - totalInvestment
    const returnPercentage = totalInvestment > 0 ? (totalReturn / totalInvestment) * 100 : 0

    return {
      data: {
        totalInvestment,
        totalCurrentValue,
        totalReturn,
        returnPercentage,
        investmentCount: data?.length || 0
      },
      error: null
    }
  }

  // Budget Goal Operations
  async createBudgetGoal(data: Partial<BudgetGoal>): Promise<{ data: BudgetGoal | null, error: any }> {
    if (!this.isAvailable()) {
      return { data: null, error: { message: 'Database not configured' } }
    }

    const { data: result, error } = await this.getClient()
      .from('budget_goals')
      .insert(data)
      .select()
      .single()

    return { data: result, error }
  }

  async getBudgetGoals(organizationId: string): Promise<{ data: BudgetGoal[], error: any }> {
    if (!this.isAvailable()) {
      return { data: [], error: { message: 'Database not configured' } }
    }

    const { data, error } = await this.getClient()
      .from('budget_goals')
      .select(`
        *,
        transaction_categories(name, color, icon)
      `)
      .eq('organization_id', organizationId)
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    return { data: data || [], error }
  }

  async updateBudgetGoal(id: string, updates: Partial<BudgetGoal>): Promise<{ data: BudgetGoal | null, error: any }> {
    if (!this.isAvailable()) {
      return { data: null, error: { message: 'Database not configured' } }
    }

    const { data, error } = await this.getClient()
      .from('budget_goals')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    return { data, error }
  }

  async deleteBudgetGoal(id: string): Promise<{ data: any, error: any }> {
    if (!this.isAvailable()) {
      return { data: null, error: { message: 'Database not configured' } }
    }

    const { data, error } = await this.getClient()
      .from('budget_goals')
      .update({ is_active: false })
      .eq('id', id)

    return { data, error }
  }

  async getBudgetGoalProgress(goalId: string): Promise<{ data: any, error: any }> {
    if (!this.isAvailable()) {
      return { data: null, error: { message: 'Database not configured' } }
    }

    const { data, error } = await this.getClient()
      .from('budget_goals')
      .select('target_amount, current_amount, target_date, name')
      .eq('id', goalId)
      .single()

    if (error) return { data: null, error }

    const progress = data.target_amount > 0 ? (data.current_amount / data.target_amount) * 100 : 0
    const daysRemaining = data.target_date ? Math.ceil((new Date(data.target_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : null

    return {
      data: {
        ...data,
        progress,
        daysRemaining,
        isCompleted: progress >= 100,
        isOverdue: daysRemaining !== null && daysRemaining < 0
      },
      error: null
    }
  }

  // Meeting Attendee Operations
  async addMeetingAttendee(meetingId: string, userId: string, status = 'invited'): Promise<{ data: MeetingAttendee | null, error: any }> {
    if (!this.isAvailable()) {
      return { data: null, error: { message: 'Database not configured' } }
    }

    const { data, error } = await this.getClient()
      .from('meeting_attendees')
      .insert({ meeting_id: meetingId, user_id: userId, status })
      .select()
      .single()

    return { data, error }
  }

  async removeMeetingAttendee(meetingId: string, userId: string): Promise<{ data: any, error: any }> {
    if (!this.isAvailable()) {
      return { data: null, error: { message: 'Database not configured' } }
    }

    const { data, error } = await this.getClient()
      .from('meeting_attendees')
      .delete()
      .eq('meeting_id', meetingId)
      .eq('user_id', userId)

    return { data, error }
  }

  async updateAttendeeStatus(meetingId: string, userId: string, status: string): Promise<{ data: MeetingAttendee | null, error: any }> {
    if (!this.isAvailable()) {
      return { data: null, error: { message: 'Database not configured' } }
    }

    const { data, error } = await this.getClient()
      .from('meeting_attendees')
      .update({ status, response_date: new Date().toISOString() })
      .eq('meeting_id', meetingId)
      .eq('user_id', userId)
      .select()
      .single()

    return { data, error }
  }

  async getMeetingAttendees(meetingId: string): Promise<{ data: any[], error: any }> {
    if (!this.isAvailable()) {
      return { data: [], error: { message: 'Database not configured' } }
    }

    const { data, error } = await this.getClient()
      .from('meeting_attendees')
      .select(`
        *,
        user_profiles(id, full_name, email, avatar_url)
      `)
      .eq('meeting_id', meetingId)

    return { data: data || [], error }
  }

  // Audit Log Operations
  async logAuditEvent(data: Partial<AuditLog>): Promise<{ data: AuditLog | null, error: any }> {
    if (!this.isAvailable()) {
      return { data: null, error: { message: 'Database not configured' } }
    }

    const { data: result, error } = await this.getClient()
      .from('audit_logs')
      .insert(data)
      .select()
      .single()

    return { data: result, error }
  }

  async getAuditLogs(organizationId: string, filters?: { 
    userId?: string, 
    tableName?: string, 
    action?: string, 
    startDate?: string, 
    endDate?: string,
    limit?: number 
  }): Promise<{ data: any[], error: any }> {
    if (!this.isAvailable()) {
      return { data: [], error: { message: 'Database not configured' } }
    }

    let query = this.getClient()
      .from('audit_logs')
      .select(`
        *,
        user_profiles(full_name, email)
      `)
      .eq('organization_id', organizationId)

    if (filters?.userId) query = query.eq('user_id', filters.userId)
    if (filters?.tableName) query = query.eq('table_name', filters.tableName)
    if (filters?.action) query = query.eq('action', filters.action)
    if (filters?.startDate) query = query.gte('created_at', filters.startDate)
    if (filters?.endDate) query = query.lte('created_at', filters.endDate)

    const { data, error } = await query
      .order('created_at', { ascending: false })
      .limit(filters?.limit || 100)

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

  // Chat Channel Operations
  async createChatChannel(data: Partial<ChatChannel>): Promise<{ data: ChatChannel | null, error: any }> {
    if (!this.isAvailable()) {
      return { data: null, error: { message: 'Database not configured' } }
    }

    const { data: result, error } = await this.getClient()
      .from('chat_channels')
      .insert(data)
      .select()
      .single()

    return { data: result, error }
  }

  async getChatChannels(organizationId: string): Promise<{ data: ChatChannel[], error: any }> {
    if (!this.isAvailable()) {
      return { data: [], error: { message: 'Database not configured' } }
    }

    const { data, error } = await this.getClient()
      .from('chat_channels')
      .select('*')
      .eq('organization_id', organizationId)
      .eq('is_archived', false)
      .order('created_at', { ascending: true })

    return { data: data || [], error }
  }

  async getChatChannel(channelId: string): Promise<{ data: ChatChannel | null, error: any }> {
    if (!this.isAvailable()) {
      return { data: null, error: { message: 'Database not configured' } }
    }

    const { data, error } = await this.getClient()
      .from('chat_channels')
      .select('*')
      .eq('id', channelId)
      .single()

    return { data, error }
  }

  async updateChatChannel(channelId: string, updates: Partial<ChatChannel>): Promise<{ data: ChatChannel | null, error: any }> {
    if (!this.isAvailable()) {
      return { data: null, error: { message: 'Database not configured' } }
    }

    const { data, error } = await this.getClient()
      .from('chat_channels')
      .update(updates)
      .eq('id', channelId)
      .select()
      .single()

    return { data, error }
  }

  async deleteChatChannel(channelId: string): Promise<{ data: any, error: any }> {
    if (!this.isAvailable()) {
      return { data: null, error: { message: 'Database not configured' } }
    }

    const { data, error } = await this.getClient()
      .from('chat_channels')
      .delete()
      .eq('id', channelId)

    return { data, error }
  }

  // Chat Channel Member Operations
  async addChannelMember(channelId: string, userId: string, role: string = 'member'): Promise<{ data: ChatChannelMember | null, error: any }> {
    if (!this.isAvailable()) {
      return { data: null, error: { message: 'Database not configured' } }
    }

    const { data, error } = await this.getClient()
      .from('chat_channel_members')
      .insert({ channel_id: channelId, user_id: userId, role })
      .select()
      .single()

    return { data, error }
  }

  async removeChannelMember(channelId: string, userId: string): Promise<{ data: any, error: any }> {
    if (!this.isAvailable()) {
      return { data: null, error: { message: 'Database not configured' } }
    }

    const { data, error } = await this.getClient()
      .from('chat_channel_members')
      .delete()
      .eq('channel_id', channelId)
      .eq('user_id', userId)

    return { data, error }
  }

  async getChannelMembers(channelId: string): Promise<{ data: any[], error: any }> {
    if (!this.isAvailable()) {
      return { data: [], error: { message: 'Database not configured' } }
    }

    const { data, error } = await this.getClient()
      .from('chat_channel_members')
      .select(`
        *,
        user_profiles(id, full_name, email, avatar_url)
      `)
      .eq('channel_id', channelId)
      .order('joined_at', { ascending: true })

    return { data: data || [], error }
  }

  async updateLastReadTime(channelId: string, userId: string): Promise<{ data: any, error: any }> {
    if (!this.isAvailable()) {
      return { data: null, error: { message: 'Database not configured' } }
    }

    const { data, error } = await this.getClient()
      .from('chat_channel_members')
      .update({ last_read_at: new Date().toISOString() })
      .eq('channel_id', channelId)
      .eq('user_id', userId)

    return { data, error }
  }

  // Chat Message Operations
  async createChatMessage(data: Partial<ChatMessage>): Promise<{ data: ChatMessage | null, error: any }> {
    if (!this.isAvailable()) {
      return { data: null, error: { message: 'Database not configured' } }
    }

    const { data: result, error } = await this.getClient()
      .from('chat_messages')
      .insert(data)
      .select()
      .single()

    return { data: result, error }
  }

  async getChatMessages(channelId: string, limit: number = 50, offset: number = 0): Promise<{ data: any[], error: any }> {
    if (!this.isAvailable()) {
      return { data: [], error: { message: 'Database not configured' } }
    }

    const { data, error } = await this.getClient()
      .from('chat_messages')
      .select(`
        *,
        user_profiles(id, clerk_user_id, full_name, email, avatar_url),
        chat_attachments(*),
        chat_message_reactions(*)
      `)
      .eq('channel_id', channelId)
      .eq('is_deleted', false)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    return { data: data || [], error }
  }

  async updateChatMessage(messageId: string, updates: Partial<ChatMessage>): Promise<{ data: ChatMessage | null, error: any }> {
    if (!this.isAvailable()) {
      return { data: null, error: { message: 'Database not configured' } }
    }

    const { data, error } = await this.getClient()
      .from('chat_messages')
      .update({ ...updates, is_edited: true })
      .eq('id', messageId)
      .select()
      .single()

    return { data, error }
  }

  async deleteChatMessage(messageId: string): Promise<{ data: any, error: any }> {
    if (!this.isAvailable()) {
      return { data: null, error: { message: 'Database not configured' } }
    }

    const { data, error } = await this.getClient()
      .from('chat_messages')
      .update({ is_deleted: true, content: 'This message has been deleted' })
      .eq('id', messageId)

    return { data, error }
  }

  // Chat Message Reaction Operations
  async addMessageReaction(messageId: string, userId: string, reaction: string): Promise<{ data: ChatMessageReaction | null, error: any }> {
    if (!this.isAvailable()) {
      return { data: null, error: { message: 'Database not configured' } }
    }

    const { data, error } = await this.getClient()
      .from('chat_message_reactions')
      .insert({ message_id: messageId, user_id: userId, reaction })
      .select()
      .single()

    return { data, error }
  }

  async removeMessageReaction(messageId: string, userId: string, reaction: string): Promise<{ data: any, error: any }> {
    if (!this.isAvailable()) {
      return { data: null, error: { message: 'Database not configured' } }
    }

    const { data, error } = await this.getClient()
      .from('chat_message_reactions')
      .delete()
      .eq('message_id', messageId)
      .eq('user_id', userId)
      .eq('reaction', reaction)

    return { data, error }
  }

  // Chat Attachment Operations
  async addMessageAttachment(data: Partial<ChatAttachment>): Promise<{ data: ChatAttachment | null, error: any }> {
    if (!this.isAvailable()) {
      return { data: null, error: { message: 'Database not configured' } }
    }

    const { data: result, error } = await this.getClient()
      .from('chat_attachments')
      .insert(data)
      .select()
      .single()

    return { data: result, error }
  }

  // Chat Mention Operations
  async createChatMention(data: Partial<ChatMention>): Promise<{ data: ChatMention | null, error: any }> {
    if (!this.isAvailable()) {
      return { data: null, error: { message: 'Database not configured' } }
    }

    const { data: result, error } = await this.getClient()
      .from('chat_mentions')
      .insert(data)
      .select()
      .single()

    return { data: result, error }
  }

  async getUnreadMentions(userId: string): Promise<{ data: any[], error: any }> {
    if (!this.isAvailable()) {
      return { data: [], error: { message: 'Database not configured' } }
    }

    const { data, error } = await this.getClient()
      .from('chat_mentions')
      .select(`
        *,
        chat_messages(
          id,
          content,
          created_at,
          user_profiles(full_name, avatar_url),
          chat_channels(name)
        )
      `)
      .eq('user_id', userId)
      .eq('is_read', false)
      .order('created_at', { ascending: false })

    return { data: data || [], error }
  }

  async markMentionAsRead(mentionId: string): Promise<{ data: any, error: any }> {
    if (!this.isAvailable()) {
      return { data: null, error: { message: 'Database not configured' } }
    }

    const { data, error } = await this.getClient()
      .from('chat_mentions')
      .update({ is_read: true })
      .eq('id', mentionId)

    return { data, error }
  }

  // Chat Utility Operations
  async getUserChannels(userId: string): Promise<{ data: any[], error: any }> {
    if (!this.isAvailable()) {
      return { data: [], error: { message: 'Database not configured' } }
    }

    const { data, error } = await this.getClient()
      .from('chat_channel_members')
      .select(`
        *,
        chat_channels(
          id,
          name,
          description,
          type,
          is_archived,
          created_at,
          updated_at
        )
      `)
      .eq('user_id', userId)
      .order('joined_at', { ascending: true })

    return { data: data || [], error }
  }

  async getUnreadMessageCount(userId: string, channelId: string): Promise<{ data: number, error: any }> {
    if (!this.isAvailable()) {
      return { data: 0, error: { message: 'Database not configured' } }
    }

    const { data, error } = await this.getClient()
      .rpc('get_unread_message_count', { user_uuid: userId, channel_uuid: channelId })

    return { data: data || 0, error }
  }

  async searchMessages(query: string, channelId?: string, limit: number = 20): Promise<{ data: any[], error: any }> {
    if (!this.isAvailable()) {
      return { data: [], error: { message: 'Database not configured' } }
    }

    let queryBuilder = this.getClient()
      .from('chat_messages')
      .select(`
        *,
        user_profiles(id, clerk_user_id, full_name, email, avatar_url),
        chat_channels(name)
      `)
      .textSearch('content', query, { type: 'websearch' })
      .eq('is_deleted', false)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (channelId) {
      queryBuilder = queryBuilder.eq('channel_id', channelId)
    }

    const { data, error } = await queryBuilder

    return { data: data || [], error }
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