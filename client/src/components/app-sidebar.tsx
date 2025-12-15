import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavUser } from "@/components/nav-user";
import { NavLink } from "react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { z } from "zod";
import { IconFile, IconInnerShadowTop } from "@tabler/icons-react";
import CreateWorkspaceDialog from "./create-workspace-dialog";

interface Workspace {
  id: string;
  name: string;
  slug: string;
  ownerId: number;
  createdAt: string;
}

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
});

export function AppSidebar() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);

  useEffect(() => {
    (async function getWorspaces() {
      try {
        const res = await fetch(
          "http://localhost:3000/api/workspace/user/all",
          {
            credentials: "include",
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (!res.ok) {
          const errorData = await res.json();
          toast.error(errorData.message);
          throw new Error("Network response was not ok");
        }

        const data = await res.json();
        setWorkspaces(data.workspaces ?? []);
        console.log("Workspace created:", data);
      } catch (err) {
        console.error("Workspace creation failed", err);
      }
    })();
  }, []);

  useEffect(() => {
    console.log("workspaces changed:", workspaces);
  }, [workspaces]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await fetch("http://localhost:3000/api/workspace/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ name: values.name, slug: values.name }),
      })
        .then(async (res) => {
          if (!res.ok) {
            const errorData = await res.json();
            console.log(errorData);

            console.log(errorData.message);
            toast.error(errorData.message);
            throw new Error("Network response was not ok");
          }
          toast.success("Workspace created");

          return res.json();
        })
        .then((data) => {
          setWorkspaces((prev) => [...prev, data.workspace]);
          console.log("Workspace created", data);
        });
      console.log(JSON.stringify(values));
    } catch (err) {
      console.error("Workspace creation failed", err);
    }
  }

  return (
    <Sidebar>
      <Dialog>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className="data-[slot=sidebar-menu-button]:p-1.5!"
              >
                <a href="#">
                  <IconInnerShadowTop className="size-5!" />
                  <span className="text-base font-semibold">ThinkTank</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>
              Your workspaces
              <DialogTrigger asChild>
                <Plus className="ml-auto group-data-[state=open]/collapsible:hidden cursor-pointer" />
              </DialogTrigger>
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {workspaces.map((workspace, index) => (
                  <SidebarMenuItem key={index}>
                    <SidebarMenuButton asChild>
                      <NavLink to={`/${index}`}>
                        <IconFile />
                        <span>{workspace.name}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          {/* <SidebarGroup>
          <SidebarGroupLabel>Your teams</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item, index) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={`/${index}`}>
                      <item.icon />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup> */}
        </SidebarContent>
        <SidebarFooter>
          <NavUser
            user={{
              name: "shadcn",
              email: "m@example.com",
              avatar: "/avatars/shadcn.jpg",
            }}
          />
        </SidebarFooter>
        <CreateWorkspaceDialog function={onSubmit} />
      </Dialog>
    </Sidebar>
  );
}
