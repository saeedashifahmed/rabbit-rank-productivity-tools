import { Button } from '@/components/ui/button'
import { CSVLink } from 'react-csv'

interface CSVExportButtonProps {
  data: { original: string; trimmed: string }[]
}

export function CSVExportButton({ data }: CSVExportButtonProps) {
  const csvData = [
    ['Original URL', 'Root Domain'],
    ...data.map(item => [item.original, item.trimmed])
  ]

  return (
    <CSVLink data={csvData} filename="trimmed_urls.csv">
      <Button variant="outline" className="w-full">
        Export to CSV
      </Button>
    </CSVLink>
  )
}

