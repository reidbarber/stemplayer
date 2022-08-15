
import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(
    request: NextApiRequest,
    response: NextApiResponse
) {
    let body = JSON.stringify({
        link: 'https://www.youtube.com/watch?v=oh2LWWORoiM',
        stem_codec: "mp3"
    });

    let requestOptions = {
        method: "POST",
        headers: new Headers().append("Content-Type", "application/json"),
        body,
        redirect: "follow"
    };

    fetch("https://api.stemplayer.com/tracks", requestOptions as any)
    .then((res) => res.json())
    .then(result => {
        response.status(200).json(result);
    }).catch(err => console.log(err));
};