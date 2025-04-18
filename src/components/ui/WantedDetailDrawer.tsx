"use client"

import { Button } from "@/components/Button"
import {
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/Drawer"
import { WantedPerson } from "@/components/ui/data-table-wanted/columns"
import Image from "next/image"
import { useEffect, useState } from "react"

interface WantedDetailDrawerProps {
  person: WantedPerson
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function WantedDetailDrawer({
  person,
  open,
  onOpenChange,
}: WantedDetailDrawerProps) {
  const [imgLoading, setImgLoading] = useState(true)
  // Reset loading when image source changes
  useEffect(() => {
    setImgLoading(true)
  }, [person.image])
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{person.title}</DrawerTitle>
          <DrawerClose />
        </DrawerHeader>
        <DrawerDescription>
        {person.description || "No description available."}
        </DrawerDescription>
        <DrawerBody className="space-y-4 overflow-y-auto">
          <div className="flex items-center justify-center">
            {imgLoading && (
              <Image
                width={100}
                height={100}
                src="/fbi.webp"
                alt="placeholder"
                className="rounded-lg object-cover"
                style={{ width: "auto", height: "auto" }}
              />
            )}
            <Image
              width={100}
              height={100}
              src={person.image || "/fbi.webp"}
              alt={`Photo of ${person.title}`}
              className={`rounded-lg object-cover transition-opacity duration-200 ${
                imgLoading ? "opacity-0" : "opacity-100"
              }`}
              onLoad={() => setImgLoading(false)}
              style={{ width: "auto", height: "auto" }}
            />
          </div>
 
          <dl className="grid grid-cols-1 gap-4">
            <div>
              <dt className="text-xs font-semibold text-gray-500">
                Date(s) of Birth Used
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-50">
                {person.dates_of_birth_used.join(", ")}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold text-gray-500">Sex</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-50">
                {person.sex}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold text-gray-500">Race</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-50">
                {person.race || "—"}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold text-gray-500">Hair</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-50">
                {person.hair || "—"}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold text-gray-500">Eyes</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-50">
                {person.eyes || "—"}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold text-gray-500">
                Height (inches)
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-50">
                {person.height || "—"}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold text-gray-500">
                Scars & Marks
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-50">
                {person.scars_and_marks || "None"}
              </dd>
            </div>
          </dl>
        </DrawerBody>
        <DrawerFooter>
          <Button asChild>
            <a
              href={person.url}
              target="_blank"
              rel="noreferrer"
              className="w-full text-center"
            >
              View on FBI
            </a>
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
