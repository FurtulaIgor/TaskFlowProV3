import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface DeleteUserRequest {
  userId: string;
  notes?: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get the authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Create Supabase client with service role key for admin operations
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Create regular client to verify the requesting user
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    // Verify the user making the request
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Check if the requesting user is an admin
    const { data: userRole, error: roleError } = await supabaseClient
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single()

    if (roleError || !userRole || userRole.role !== 'admin') {
      return new Response(
        JSON.stringify({ error: 'Insufficient permissions' }),
        { 
          status: 403, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Parse request body
    const { userId, notes }: DeleteUserRequest = await req.json()

    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'User ID is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Prevent admin from deleting themselves
    if (user.id === userId) {
      return new Response(
        JSON.stringify({ error: 'Cannot delete your own account' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Delete all related data for the user using admin client
    // Delete user_roles
    const { error: roleDeleteError } = await supabaseAdmin
      .from('user_roles')
      .delete()
      .eq('user_id', userId)

    if (roleDeleteError) {
      console.error('Error deleting user roles:', roleDeleteError)
      throw new Error('Failed to delete user roles')
    }

    // Delete user_profiles
    const { error: profileDeleteError } = await supabaseAdmin
      .from('user_profiles')
      .delete()
      .eq('user_id', userId)

    if (profileDeleteError) {
      console.error('Error deleting user profile:', profileDeleteError)
      // Don't throw here as profile might not exist
    }

    // Delete user's clients
    const { error: clientsDeleteError } = await supabaseAdmin
      .from('clients')
      .delete()
      .eq('user_id', userId)

    if (clientsDeleteError) {
      console.error('Error deleting user clients:', clientsDeleteError)
      throw new Error('Failed to delete user clients')
    }

    // Delete user's services
    const { error: servicesDeleteError } = await supabaseAdmin
      .from('services')
      .delete()
      .eq('user_id', userId)

    if (servicesDeleteError) {
      console.error('Error deleting user services:', servicesDeleteError)
      throw new Error('Failed to delete user services')
    }

    // Delete user's appointments
    const { error: appointmentsDeleteError } = await supabaseAdmin
      .from('appointments')
      .delete()
      .eq('user_id', userId)

    if (appointmentsDeleteError) {
      console.error('Error deleting user appointments:', appointmentsDeleteError)
      throw new Error('Failed to delete user appointments')
    }

    // Delete user's invoices
    const { error: invoicesDeleteError } = await supabaseAdmin
      .from('invoices')
      .delete()
      .eq('user_id', userId)

    if (invoicesDeleteError) {
      console.error('Error deleting user invoices:', invoicesDeleteError)
      throw new Error('Failed to delete user invoices')
    }

    // Finally, delete the user from auth.users using admin client
    const { error: deleteUserError } = await supabaseAdmin.auth.admin.deleteUser(userId)

    if (deleteUserError) {
      console.error('Error deleting user from auth:', deleteUserError)
      throw new Error('Failed to delete user account')
    }

    // Log the admin action
    const { error: actionError } = await supabaseAdmin
      .from('admin_actions')
      .insert([{
        admin_id: user.id,
        action_type: 'delete_user',
        target_user_id: userId,
        notes: notes || null
      }])

    if (actionError) {
      console.error('Error logging admin action:', actionError)
      // Don't throw here as the main operation succeeded
    }

    return new Response(
      JSON.stringify({ success: true, message: 'User deleted successfully' }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error: any) {
    console.error('Error in delete-user function:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An unexpected error occurred while deleting user' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})