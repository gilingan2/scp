import prisma from '@utils/prisma'
import type { NextApiRequest, NextApiResponse } from 'next/types'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const { uid } = req.query as { uid: string }
      const existingSubmission = await prisma.artistSubmissions.findUnique({
        where: { uid },
        select: {
          uid: true,
          id: true,
        },
      })

      if (!existingSubmission) {
        return res.status(404).json({
          success: false,
          error: 'Artist submission with this UID not found',
          isExist: false,
        })
      }
      res.status(200).json({
        success: true,
        data: existingSubmission,
        message: 'Artist submission with this UID already exists',
        isExist: true,
      })
    } catch (error) {
      console.error('Error creating artist submission:', error)
      res.status(500).json({
        success: false,
        error: 'Failed to create artist submission',
        details: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
