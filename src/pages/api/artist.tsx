// pages/api/artist.ts
import prisma from '@utils/prisma';
import type { NextApiRequest, NextApiResponse } from 'next/types';



export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { artist } = req.query;

  try {

    const artistData = await prisma.artistSubmissions.findUnique({
      where: { uid: artist as string },
      select: {
        name: true,
        description: true,
        bio: true,
      },
    });
    const ArtistSubmissionsSocials = await prisma.artistSubmissionsSocials.findUnique({
      where: { artistSubmissionId: artist as string },
      select: {
        imageUrl: true,
        spotifyUrl: true,
        twitterUrl: true,
        instagramUrl: true,
        geniusUrl: true,
      },
    });
    const tracksData = await prisma.track.findMany({
      where: { artistSubmissionId: artist as string },
    });

    const responseData = {
      success: true,
      ...artistData,
      ArtistSubmissionsSocials,
      tracksData
    }
    console.log(tracksData)
    res.json(responseData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching data' });
  }
}