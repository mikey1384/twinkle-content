import { useContext } from 'react';
import { AppContext } from './AppContext';
import { ChatContext } from './Chat';
import { ContentContext } from './Content';
import { ExploreContext } from './Explore';
import { HomeContext } from './Home';
import { InputContext } from './Input';
import { InteractiveContext } from './Interactive';
import { ManagementContext } from './Management';
import { NotiContext } from './Notification';
import { ProfileContext } from './Profile';
import { TaskContext } from './Task';
import { ViewContext } from './View';

export function useAppContext() {
  return useContext(AppContext);
}
export function useChatContext() {
  return useContext(ChatContext);
}
export function useContentContext() {
  return useContext(ContentContext);
}
export function useExploreContext() {
  return useContext(ExploreContext);
}
export function useHomeContext() {
  return useContext(HomeContext);
}
export function useInputContext() {
  return useContext(InputContext);
}
export function useInteractiveContext() {
  return useContext(InteractiveContext);
}
export function useManagementContext() {
  return useContext(ManagementContext);
}
export function useNotiContext() {
  return useContext(NotiContext);
}
export function useProfileContext() {
  return useContext(ProfileContext);
}
export function useTaskContext() {
  return useContext(TaskContext);
}
export function useViewContext() {
  return useContext(ViewContext);
}
