import { Router, Request, Response } from 'express'
import { supabase } from '../lib/supabase'
import { verifyToken } from '../middleware/auth'

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

// ─── PROTECTED (admin only) ───────────────────────────────────────────────────

// GET /api/projects/all — returns ALL projects including hidden ones
router.get('/all', verifyToken, async (req: Request, res: Response) => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('year', { ascending: false })
    .order('display_order', { ascending: true })

  if (error) {
    res.status(500).json({ message: 'Failed to fetch projects', error: error.message })
    return
  }

  res.json(data)
})

// POST /api/projects — create a new project
router.post('/', verifyToken, async (req: Request, res: Response) => {
  const {
    name,
    description,
    image_url,
    year,
    display_order,
    is_visible,
    category,
    framer_url,
    document_url,
    document_name,
  } = req.body

  if (!name || !year || !category) {
    res.status(400).json({ message: 'name, year and category are required' })
    return
  }

  const { data, error } = await supabase
    .from('projects')
    .insert([{
      name,
      description: description || null,
      image_url: image_url || null,
      year: Number(year),
      display_order: display_order ?? 0,
      is_visible: is_visible ?? true,
      category,
      framer_url: framer_url || null,
      document_url: document_url || null,
      document_name: document_name || null,
    }])
    .select()
    .single()

  if (error) {
    console.error('Insert error:', error)
    res.status(500).json({ message: 'Failed to create project', error: error.message })
    return
  }

  res.status(201).json(data)
})

// PATCH /api/projects/:id — update a project
router.patch('/:id', verifyToken, async (req: Request, res: Response) => {
  const { id } = req.params
  const updates = req.body

  const { data, error } = await supabase
    .from('projects')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    res.status(500).json({ message: 'Failed to update project', error: error.message })
    return
  }

  res.json(data)
})

// PATCH /api/projects/:id/visibility — toggle visibility
router.patch('/:id/visibility', verifyToken, async (req: Request, res: Response) => {
  const { id } = req.params
  const { is_visible } = req.body

  const { data, error } = await supabase
    .from('projects')
    .update({ is_visible })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    res.status(500).json({ message: 'Failed to update visibility', error: error.message })
    return
  }

  res.json(data)
})

// DELETE /api/projects/:id — delete a project
router.delete('/:id', verifyToken, async (req: Request, res: Response) => {
  const { id } = req.params

  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id)

  if (error) {
    res.status(500).json({ message: 'Failed to delete project', error: error.message })
    return
  }

  res.json({ message: 'Project deleted successfully' })
})

export default router
