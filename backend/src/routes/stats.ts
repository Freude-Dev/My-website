import { Router, Request, Response } from 'express'
import { supabase } from '../lib/supabase'

const router = Router()

router.get('/', async (req: Request, res: Response) => {
  const [services, projects, testimonials, inquiries] = await Promise.all([
    supabase.from('services').select('id', { count: 'exact', head: true }),
    supabase.from('projects').select('id', { count: 'exact', head: true }),
    supabase.from('testimonials').select('id', { count: 'exact', head: true }),
    supabase.from('contact_messages').select('id', { count: 'exact', head: true }),
  ])

  res.json({
    services: services.count || 0,
    projects: projects.count || 0,
    testimonials: testimonials.count || 0,
    inquiries: inquiries.count || 0,
  })
})

export default router