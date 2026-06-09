import type { Chapter } from '@/types/game'
import type { Track } from '@/types/smartphone'

export const CHAPTER_PLAYLISTS: Record<Chapter, Track[]> = {
  prologue: [
    {
      id: 'pro_1',
      title: 'Prologue',
      artist: 'OST: Memories of You',
      duration: '3:12',
      src: '/audio/bgm/prologue.mp3',
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
      title: 'Something Seems Off About You',
      artist: 'OST: Memories of You',
      duration: '3:40',
      src: '/audio/bgm/denial%20-%20something%20seems%20off%20about%20you.wav',
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
      title: 'I Feel It Coming to an End',
      artist: 'OST: Memories of You',
      duration: '5:10',
      src: '/audio/bgm/depression%20-%20i%20feel%20it%20coming%20to%20an%20end.wav',
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
      title: 'Finally I Can Let You Go',
      artist: 'OST: Memories of You',
      duration: '3:28',
      src: '/audio/bgm/acceptance%20-%20finally%20i%20can%20let%20you%20go.wav',
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
      title: 'Epilogue',
      artist: 'OST: Memories of You',
      duration: '4:15',
      src: '/audio/bgm/epilogue.mp3',
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
