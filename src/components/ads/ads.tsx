import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'

function AdTemplate() {
   return (
      <div className="hidden lg:block">
         <Card className="sticky top-6 h-full min-h-[200px] bg-slate-900/50 ring-foreground/5" aria-label="Advertisement right">
            <CardHeader>
               <CardTitle className="text-sm text-muted-foreground">Sponsored</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">Ad space</CardContent>
         </Card>
      </div>
   )
}

export default AdTemplate