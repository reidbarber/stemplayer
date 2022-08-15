import { useState, useEffect } from "react";

export default function Home() {
  const [data, setData] = useState(null)
  const [isLoading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    fetch('https://stemplayer-next.vercel.app/api/tracks', {link: 'https://www.youtube.com/watch?v=oh2LWWORoiM'} as any)
      .then((res) => res.json())
      .then((data) => {
        setData(data)
        console.log(data);
        setLoading(false)
      })
  }, [])

  if (isLoading) return <p>Loading...</p>
  if (!data) return <p>No data</p>
  

  return (
    'tests'
  )
}
