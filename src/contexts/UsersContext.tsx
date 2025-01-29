'use client';

import { createContext, useEffect, useState } from "react";

import { toast } from "sonner";

import type { User } from "@/core/domain/gateways/user.gateway";
import type { UsersType } from "@/types/apps/userTypes";
import { userGateway } from "@/core/infra/gateways/user.gateway.impl.singleton";

type UsersContextType = {
  users: UsersType[];
  fetchUsers: () => Promise<void>;
  deleteUser(userId: string): Promise<void>;
}

const adapter = (data: User): UsersType => ({
  id: data.userId,
  role: data.role,
  email: data.email,
  firstName: data.firstName,
  lastName: data.lastName,
  managerId: data.managerId,
  avatar: '',
  contacts: data.phoneNumbers,
  document: data.docNumber,
  managerName: data.managerName,
})

const UsersContext = createContext<UsersContextType | undefined>(undefined);

type Props = {
  children: React.ReactNode
}

const UsersProvider = ({ children }: Props) => {
  const [users, setUsers] = useState<UsersType[]>([]);

  async function fetchUsers() {
    try {
      const res = await userGateway.getAllUsers()
      const users = res.map(adapter)

      setUsers(users)
    } catch (error) {
      console.error(error);
      toast.error('Erro ao buscar usuários')
    }
  }


  async function deleteUser(userId: string) {
    try {
      await userGateway.deleteUser(userId);
      await fetchUsers()

    } catch (error) {
      console.error(error);
      toast.error(`Erro ao excluir o usuário: ${(error as Error).message}`)
    }
  }

  useEffect(() => {
    (async () => {
      await fetchUsers()
    })()
  }, [])

  return (
    <UsersContext.Provider value={{
      users,
      fetchUsers,
      deleteUser
    }}>
      {children}
    </UsersContext.Provider>
  )
}

export { UsersContext, UsersProvider }

