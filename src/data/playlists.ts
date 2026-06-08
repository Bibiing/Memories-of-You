import type { Chapter } from '@/types/game'
import type { Track } from '@/types/smartphone'

export const CHAPTER_PLAYLISTS: Record<Chapter, Track[]> = {
  prologue: [
    {
      id: 'pro_1',
      title: 'Perkenalan',
      artist: 'OST: Memories of You',
      duration: '3:12',
      src: '/audio/bgm/prologue_01.mp3',
    },
    {
      id: 'pro_2',
      title: 'Taman Sore',
      artist: 'OST: Memories of You',
      duration: '2:55',
      src: '/audio/bgm/prologue_02.mp3',
    },
  ],
  denial: [
    {
      id: 'den_1',
      title: 'Bukan Akhir',
      artist: 'OST: Memories of You',
      duration: '3:40',
      src: '/audio/bgm/denial_01.mp3',
    },
    {
      id: 'den_2',
      title: 'Menunggu',
      artist: 'OST: Memories of You',
      duration: '4:05',
      src: '/audio/bgm/denial_02.mp3',
    },
  ],
  anger: [
    {
      id: 'ang_1',
      title: 'Api',
      artist: 'OST: Memories of You',
      duration: '2:30',
      src: '/audio/bgm/anger_01.mp3',
    },
    {
      id: 'ang_2',
      title: 'Labirin',
      artist: 'OST: Memories of You',
      duration: '3:15',
      src: '/audio/bgm/anger_02.mp3',
    },
  ],
  bargaining: [
    {
      id: 'bar_1',
      title: 'Kalau Saja',
      artist: 'OST: Memories of You',
      duration: '4:22',
      src: '/audio/bgm/bargaining_01.mp3',
    },
    {
      id: 'bar_2',
      title: 'Surat Tak Terkirim',
      artist: 'OST: Memories of You',
      duration: '3:50',
      src: '/audio/bgm/bargaining_02.mp3',
    },
  ],
  depression: [
    {
      id: 'dep_1',
      title: 'Sunyi',
      artist: 'OST: Memories of You',
      duration: '5:10',
      src: '/audio/bgm/depression_01.mp3',
    },
    {
      id: 'dep_2',
      title: 'Hujan di Dalam',
      artist: 'OST: Memories of You',
      duration: '4:40',
      src: '/audio/bgm/depression_02.mp3',
    },
  ],
  acceptance: [
    {
      id: 'acc_1',
      title: 'Ikhlas',
      artist: 'OST: Memories of You',
      duration: '3:28',
      src: '/audio/bgm/acceptance_01.mp3',
    },
    {
      id: 'acc_2',
      title: 'Cahaya Baru',
      artist: 'OST: Memories of You',
      duration: '3:55',
      src: '/audio/bgm/acceptance_02.mp3',
    },
  ],
  epilogue: [
    {
      id: 'epi_1',
      title: 'Cerita Kita',
      artist: 'OST: Memories of You',
      duration: '4:15',
      src: '/audio/bgm/epilogue_01.mp3',
    },
    {
      id: 'epi_2',
      title: 'Terima Kasih',
      artist: 'OST: Memories of You',
      duration: '3:30',
      src: '/audio/bgm/epilogue_02.mp3',
    },
  ],
}
