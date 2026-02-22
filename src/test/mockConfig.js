export const mockConfig = {
  albumName: "Test Album",
  artistName: "Test Artist",
  pageTitle: "Test Artist – Test Album",
  images: {
    front: "images/Front.png",
    lyrics: "images/Lyrics.png",
    lyricsBack: "images/LyricsBack.png",
    back: "images/Back.png"
  },
  colors: {
    primary: "#5B96C7",
    heroBackground: "#5B96C7",
    background: "#1a1a1a",
    text: "#e0e0e0"
  },
  tracks: [
    {
      side: "A",
      number: "A1",
      name: "Test Song 1",
      duration: "3'00\"",
      file: "test_song_1.mp3",
      lyrics: "Test lyrics\nLine 2\nLine 3"
    },
    {
      side: "A",
      number: "A2",
      name: "Test Song 2",
      duration: "2'30\"",
      file: "test_song_2.mp3",
      lyrics: "More test lyrics"
    },
    {
      side: "B",
      number: "B1",
      name: "Instrumental",
      duration: "4'00\"",
      file: "instrumental.mp3",
      lyrics: null
    }
  ],
  credits: {
    paragraphs: [
      "Test credits line 1",
      {
        text: "Visit ",
        link: {
          text: "Test Studio",
          url: "https://test-studio.com"
        },
        suffix: " for more."
      }
    ]
  },
  links: {
    github: "https://github.com/test/repo",
    instagram: "https://instagram.com/test",
    bandcamp: "https://test.bandcamp.com"
  },
  footer: "Test footer message",
  downloadZip: "test-album.zip"
}
