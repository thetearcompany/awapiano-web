import { z } from "zod"
import { router } from "../../../index"
import { adminProcedure } from "../../middlewares/admin"
import { TRPCError } from "@trpc/server"

export const adminMusicRouter = router({
  // Get all tracks with pagination and filtering
  getTracks: adminProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10),
        cursor: z.string().optional(),
        search: z.string().optional(),
        artistId: z.string().optional(),
        albumId: z.string().optional(),
        published: z.boolean().optional(),
        sortBy: z.enum(["title", "createdAt", "duration"]).optional(),
        sortDirection: z.enum(["asc", "desc"]).optional().default("desc"),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { limit, cursor, search, artistId, albumId, published, sortBy, sortDirection } = input

      const where = {
        ...(search && {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
          ],
        }),
        ...(artistId && { artistId }),
        ...(albumId && { albumId }),
        ...(published !== undefined && { published }),
      }

      const orderBy = sortBy ? { [sortBy]: sortDirection } : { createdAt: sortDirection }

      const tracks = await ctx.prisma.track.findMany({
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        where,
        orderBy,
        include: {
          artist: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          album: {
            select: {
              id: true,
              title: true,
              coverImage: true,
            },
          },
          tags: {
            select: {
              id: true,
              name: true,
            },
          },
          _count: {
            select: {
              playbacks: true,
            },
          },
        },
      })

      let nextCursor: string | undefined = undefined
      if (tracks.length > limit) {
        const nextItem = tracks.pop()
        nextCursor = nextItem?.id
      }

      return {
        tracks,
        nextCursor,
      }
    }),

  // Get track by ID
  getTrackById: adminProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const track = await ctx.prisma.track.findUnique({
        where: { id: input.id },
        include: {
          artist: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          album: {
            select: {
              id: true,
              title: true,
              coverImage: true,
            },
          },
          tags: {
            select: {
              id: true,
              name: true,
            },
          },
          playlists: {
            select: {
              id: true,
              title: true,
              coverImage: true,
            },
          },
          _count: {
            select: {
              playbacks: true,
            },
          },
        },
      })

      if (!track) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Track not found",
        })
      }

      return track
    }),

  // Create track
  createTrack: adminProcedure
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().optional(),
        audioUrl: z.string().min(1),
        coverImage: z.string().optional(),
        duration: z.number().min(0),
        bpm: z.number().optional(),
        key: z.string().optional(),
        published: z.boolean().default(false),
        artistId: z.string(),
        albumId: z.string().optional(),
        tagIds: z.array(z.string()).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { tagIds, ...data } = input

      // Create track
      const track = await ctx.prisma.track.create({
        data: {
          ...data,
          ...(tagIds &&
            tagIds.length > 0 && {
              tags: {
                connect: tagIds.map((id) => ({ id })),
              },
            }),
        },
      })

      return track
    }),

  // Update track
  updateTrack: adminProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(1).optional(),
        description: z.string().optional(),
        audioUrl: z.string().min(1).optional(),
        coverImage: z.string().optional(),
        duration: z.number().min(0).optional(),
        bpm: z.number().optional(),
        key: z.string().optional(),
        published: z.boolean().optional(),
        artistId: z.string().optional(),
        albumId: z.string().optional(),
        tagIds: z.array(z.string()).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, tagIds, ...data } = input

      // Check if track exists
      const existingTrack = await ctx.prisma.track.findUnique({
        where: { id },
      })

      if (!existingTrack) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Track not found",
        })
      }

      // Update track
      const track = await ctx.prisma.track.update({
        where: { id },
        data: {
          ...data,
          ...(tagIds && {
            tags: {
              set: tagIds.map((id) => ({ id })),
            },
          }),
        },
      })

      return track
    }),

  // Delete track
  deleteTrack: adminProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Check if track exists
      const existingTrack = await ctx.prisma.track.findUnique({
        where: { id: input.id },
      })

      if (!existingTrack) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Track not found",
        })
      }

      // Delete track
      await ctx.prisma.track.delete({
        where: { id: input.id },
      })

      return { success: true }
    }),

  // Get all albums with pagination
  getAlbums: adminProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10),
        cursor: z.string().optional(),
        search: z.string().optional(),
        sortBy: z.enum(["title", "createdAt", "releaseDate"]).optional(),
        sortDirection: z.enum(["asc", "desc"]).optional().default("desc"),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { limit, cursor, search, sortBy, sortDirection } = input

      const where = {
        ...(search && {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
          ],
        }),
      }

      const orderBy = sortBy ? { [sortBy]: sortDirection } : { createdAt: sortDirection }

      const albums = await ctx.prisma.album.findMany({
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        where,
        orderBy,
        include: {
          _count: {
            select: {
              tracks: true,
            },
          },
        },
      })

      let nextCursor: string | undefined = undefined
      if (albums.length > limit) {
        const nextItem = albums.pop()
        nextCursor = nextItem?.id
      }

      return {
        albums,
        nextCursor,
      }
    }),

  // Get album by ID
  getAlbumById: adminProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const album = await ctx.prisma.album.findUnique({
        where: { id: input.id },
        include: {
          tracks: {
            include: {
              artist: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                },
              },
            },
          },
        },
      })

      if (!album) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Album not found",
        })
      }

      return album
    }),

  // Create album
  createAlbum: adminProcedure
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().optional(),
        coverImage: z.string().optional(),
        releaseDate: z.date().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Create album
      const album = await ctx.prisma.album.create({
        data: input,
      })

      return album
    }),

  // Update album
  updateAlbum: adminProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(1).optional(),
        description: z.string().optional(),
        coverImage: z.string().optional(),
        releaseDate: z.date().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input

      // Check if album exists
      const existingAlbum = await ctx.prisma.album.findUnique({
        where: { id },
      })

      if (!existingAlbum) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Album not found",
        })
      }

      // Update album
      const album = await ctx.prisma.album.update({
        where: { id },
        data,
      })

      return album
    }),

  // Delete album
  deleteAlbum: adminProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Check if album exists
      const existingAlbum = await ctx.prisma.album.findUnique({
        where: { id: input.id },
      })

      if (!existingAlbum) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Album not found",
        })
      }

      // Check if album has tracks
      const tracksCount = await ctx.prisma.track.count({
        where: { albumId: input.id },
      })

      if (tracksCount > 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cannot delete album with tracks. Remove tracks first.",
        })
      }

      // Delete album
      await ctx.prisma.album.delete({
        where: { id: input.id },
      })

      return { success: true }
    }),

  // Get all playlists with pagination
  getPlaylists: adminProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10),
        cursor: z.string().optional(),
        search: z.string().optional(),
        sortBy: z.enum(["title", "createdAt"]).optional(),
        sortDirection: z.enum(["asc", "desc"]).optional().default("desc"),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { limit, cursor, search, sortBy, sortDirection } = input

      const where = {
        ...(search && {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
          ],
        }),
      }

      const orderBy = sortBy ? { [sortBy]: sortDirection } : { createdAt: sortDirection }

      const playlists = await ctx.prisma.playlist.findMany({
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        where,
        orderBy,
        include: {
          _count: {
            select: {
              tracks: true,
            },
          },
        },
      })

      let nextCursor: string | undefined = undefined
      if (playlists.length > limit) {
        const nextItem = playlists.pop()
        nextCursor = nextItem?.id
      }

      return {
        playlists,
        nextCursor,
      }
    }),

  // Get playlist by ID
  getPlaylistById: adminProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const playlist = await ctx.prisma.playlist.findUnique({
        where: { id: input.id },
        include: {
          tracks: {
            include: {
              artist: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                },
              },
            },
          },
        },
      })

      if (!playlist) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Playlist not found",
        })
      }

      return playlist
    }),

  // Create playlist
  createPlaylist: adminProcedure
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().optional(),
        coverImage: z.string().optional(),
        isPublic: z.boolean().default(true),
        trackIds: z.array(z.string()).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { trackIds, ...data } = input

      // Create playlist
      const playlist = await ctx.prisma.playlist.create({
        data: {
          ...data,
          ...(trackIds &&
            trackIds.length > 0 && {
              tracks: {
                connect: trackIds.map((id) => ({ id })),
              },
            }),
        },
      })

      return playlist
    }),

  // Update playlist
  updatePlaylist: adminProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(1).optional(),
        description: z.string().optional(),
        coverImage: z.string().optional(),
        isPublic: z.boolean().optional(),
        trackIds: z.array(z.string()).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, trackIds, ...data } = input

      // Check if playlist exists
      const existingPlaylist = await ctx.prisma.playlist.findUnique({
        where: { id },
      })

      if (!existingPlaylist) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Playlist not found",
        })
      }

      // Update playlist
      const playlist = await ctx.prisma.playlist.update({
        where: { id },
        data: {
          ...data,
          ...(trackIds && {
            tracks: {
              set: trackIds.map((id) => ({ id })),
            },
          }),
        },
      })

      return playlist
    }),

  // Delete playlist
  deletePlaylist: adminProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Check if playlist exists
      const existingPlaylist = await ctx.prisma.playlist.findUnique({
        where: { id: input.id },
      })

      if (!existingPlaylist) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Playlist not found",
        })
      }

      // Delete playlist
      await ctx.prisma.playlist.delete({
        where: { id: input.id },
      })

      return { success: true }
    }),

  // Get track stats
  getTrackStats: adminProcedure.query(async ({ ctx }) => {
    // Get total tracks
    const totalTracks = await ctx.prisma.track.count()

    // Get published tracks
    const publishedTracks = await ctx.prisma.track.count({
      where: { published: true },
    })

    // Get total playbacks
    const totalPlaybacks = await ctx.prisma.playback.count()

    // Get tracks by artist
    const tracksByArtist = await ctx.prisma.track.groupBy({
      by: ["artistId"],
      _count: true,
      orderBy: {
        _count: {
          _all: "desc",
        },
      },
      take: 5,
    })

    // Get artist details
    const artistIds = tracksByArtist.map((item) => item.artistId)
    const artists = await ctx.prisma.user.findMany({
      where: {
        id: {
          in: artistIds,
        },
      },
      select: {
        id: true,
        name: true,
        image: true,
      },
    })

    // Get most played tracks
    const mostPlayedTracks = await ctx.prisma.playback.groupBy({
      by: ["trackId"],
      _count: true,
      orderBy: {
        _count: {
          _all: "desc",
        },
      },
      take: 5,
    })

    const trackIds = mostPlayedTracks.map((item) => item.trackId)
    const tracks = await ctx.prisma.track.findMany({
      where: {
        id: {
          in: trackIds,
        },
      },
      include: {
        artist: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    })

    return {
      totalTracks,
      publishedTracks,
      totalPlaybacks,
      tracksByArtist: tracksByArtist.map((item) => ({
        artistId: item.artistId,
        count: item._count,
        artist: artists.find((a) => a.id === item.artistId),
      })),
      mostPlayedTracks: mostPlayedTracks.map((item) => ({
        trackId: item.trackId,
        count: item._count,
        track: tracks.find((t) => t.id === item.trackId),
      })),
    }
  }),
})

