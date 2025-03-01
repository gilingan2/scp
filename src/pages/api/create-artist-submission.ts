import prisma from '@utils/prisma'
import type { NextApiRequest, NextApiResponse } from 'next/types'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const {
        uid,
        name,
        description,
        bio,
        imageUrl,
        spotifyUrl,
        twitterUrl,
        instagramUrl,
        geniusUrl,
      } = req.body
      const existingSubmission = await prisma.artistSubmissions.findUnique({
        where: { uid },
      })

      if (existingSubmission) {
        // Either update the existing submission or return an error to the user
        return res
          .status(400)
          .json({ error: 'Submission with this UID already exists' })
      }

      const artistSubmission = await prisma.artistSubmissions.create({
        data: {
          uid,
          name,
          description,
          bio,
          published: true,
          ArtistSubmissionsSocials: {
            create: {
              imageUrl,
              spotifyUrl,
              twitterUrl,
              instagramUrl,
              geniusUrl,
            },
          },
        },
      })

      res.status(200).json({ success: true, data: artistSubmission })
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
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
