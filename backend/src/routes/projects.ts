import { Router, Request, Response } from 'express'
import { supabase } from '../lib/supabase'

const router = Router()

// GET /api/projects — returns projects grouped by year
router.get('/', async (req: Request, res: Response) => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('year', { ascending: true })
    .order('created_at', { ascending: true })

  if (error) {
    res.status(500).json({ message: 'Failed to fetch projects', error: error.message })
    return
  }

  // Group by year: { "2018": [...], "2020": [...] }
  const grouped = data.reduce((acc: Record<string, typeof data>, project) => {
    const year = String(project.year)
    if (!acc[year]) acc[year] = []
    acc[year].push(project)
    return acc
  }, {})

  res.json({ Projects: grouped })
})

export default router
