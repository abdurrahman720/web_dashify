import BlurPage from '@/components/global/blur-page'
import MediaComponent from '@/components/media'
import { getMedia } from '@/lib/queries'
import React from 'react'

type Props = {
    params: {
        subAccountId: string
    }
}

const MediaPage =async ({ params }: Props) => {
    const data = await getMedia(params.subAccountId)


  return (
      <BlurPage>
          <MediaComponent data={data} subAccountId={params.subAccountId}  />
    </BlurPage>
  )
}

export default MediaPage;