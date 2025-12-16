import { AppSidebar } from "@/components/app-sidebar";
import CreateModelDialog from "@/components/create-model-dialog";
import { ModeToggle } from "@/components/mode-toggle";
import ModelTable from "@/components/model-table";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Dialog } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useParams } from "react-router";

export default function WorkspacePage() {
  const { workspaceId } = useParams();

  const { data, isLoading } = useQuery({
    queryKey: ["workspace", workspaceId],
    queryFn: () =>
      fetch(`/api/workspace/${workspaceId}`, { credentials: "include" }).then(
        (r) => r.json()
      ),
    enabled: !!workspaceId,
  });

  if (isLoading) return "Loading...";
  //   return <pre>{JSON.stringify(data, null, 2)}</pre>;

  return (
    <React.Fragment>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbPage>Workspace #{workspaceId}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              <ModeToggle />
            </div>
          </header>
          <Dialog>
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
              <div className="grid auto-rows-min gap-4 md:grid-cols-2">
                <div className="bg-muted/50 aspect-video rounded-xl">
                  <Table>
                    {!data.workspace ? (
                      <TableCaption>No workspace found.</TableCaption>
                    ) : null}
                    <TableHeader>
                      <TableRow>
                        <TableHead>Workspace name</TableHead>
                        <TableHead>Created at</TableHead>
                        <TableHead className="text-right">
                          Models count
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    {data.workspace ? (
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">
                            {data.workspace?.name}
                          </TableCell>
                          <TableCell>
                            {new Date(
                              data.workspace?.createdAt
                            ).toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right">
                            {data.models?.length}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    ) : null}
                  </Table>
                </div>
                <div className="bg-muted/50 aspect-video rounded-xl">
                  <ModelTable models={data.models} />
                </div>
              </div>
            </div>
            <CreateModelDialog />
          </Dialog>
        </SidebarInset>
      </SidebarProvider>
    </React.Fragment>
  );
}
