import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { IconDots } from "@tabler/icons-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSidebar } from "./ui/sidebar";
import { NavLink, useParams } from "react-router";

export default function ModelTable({
  models,
}: {
  models: { id: string; name: string; createdAt: string }[];
}) {
  const { isMobile } = useSidebar();
  const { workspaceId } = useParams();
  return (
    <React.Fragment>
      <Table>
        {models?.length == 0 ? (
          <TableCaption>No models found.</TableCaption>
        ) : null}
        <TableCaption>
          <DialogTrigger asChild>
            <Button className="cursor-pointer" size="sm">
              Create model
            </Button>
          </DialogTrigger>
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Model name</TableHead>
            <TableHead>Created at</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {models?.map(
            (model: { id: string; name: string; createdAt: string }) => (
              <TableRow key={model.id}>
                <TableCell className="font-medium">{model?.name}</TableCell>
                <TableCell>
                  {new Date(model?.createdAt).toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild className="cursor-pointer">
                      <IconDots className="ml-auto size-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                      side={isMobile ? "bottom" : "right"}
                      align="end"
                      sideOffset={4}
                    >
                      <DropdownMenuGroup>
                        <DropdownMenuItem asChild>
                          <NavLink
                            to={`/workspace/${workspaceId}/model/${model.id}`}
                          >
                            View
                          </NavLink>
                        </DropdownMenuItem>
                        <DropdownMenuItem>Rename</DropdownMenuItem>
                        <DropdownMenuItem>Delete</DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )
          )}
        </TableBody>
      </Table>
    </React.Fragment>
  );
}
