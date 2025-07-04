'use client'

import React, { useEffect, useState } from 'react'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenu,
  useSidebar,

} from '@/components/ui/sidebar'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { LayoutDashboard, Bot, Presentation, CreditCard } from 'lucide-react'
import Link from 'next/link'  // Make sure to import this
import { Button } from '@/components/ui/button'  // Import the Button component
import { Plus } from 'lucide-react'  // Import the Plus icon
// ✨ DON'T import from 'process' — remove `import type { title } from 'process'`
import Image from 'next/image';
import useProject from '@/hooks/use-project'


const items = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Q@A',
    url: '/qa',
    icon: Bot,
  },
  {
    title: 'Meetings',
    url: '/meetings',
    icon: Presentation,
  },
  {
    title: 'Billing',
    url: '/billing',
    icon: CreditCard,
  },
]


export const AppSidebar = () => {
  const pathname = usePathname()
  const {open} = useSidebar() 
  const [isMounted, setIsMounted] = useState(false)
  const { projects , projectId, setProjectId } = useProject() // Assuming you have a hook to fetch projects

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null  // 🛡️ Prevents mismatch

  return (
    <Sidebar collapsible="icon" variant="floating">
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Image src ="/logo.png" alt="Logo" width={40} height={40} />
          {open && (
            <h1 className="text-x1 font-bold text-primary/100">
              Decode
            </h1>
          )}
          
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu> 
            {items.map((item) => {
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={item.url}
                      className={cn({
                        '!bg-primary !text-white': pathname === item.url
                      }, 'list-none')}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Projects</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {projects?.map((project) => {
                return (
                  <SidebarMenuItem key={project.name}>
                    <SidebarMenuButton asChild>
                      <div onClick={() => setProjectId(project.id)}> 
                        <div className={cn(
                          'rounded-sm border size-6 flex items-center justify-center text-sm bg-white text-primary',
                          {
                            '!bg-primary text-white': project.id === projectId
                          }
                        )}>
                          {project.name[0]}
                        </div>
                        <span>{project.name}</span>
                      </div>
                      
                    </SidebarMenuButton>
                    </SidebarMenuItem>
                )
              })}
              <div className="h-2"></div>
              
              {open && (
                <SidebarMenuItem>
            <Link href="/create" className="w-full"><Button size='sm' variant={'outline'} className='w-fit'><Plus />Create Project</Button></Link>
            </SidebarMenuItem>
          )}
                
              
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
