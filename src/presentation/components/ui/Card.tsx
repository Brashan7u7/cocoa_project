import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface CardProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  onPress?: () => void;
  selected?: boolean;
  children?: React.ReactNode;
  accentColor?: string;
}

export const Card: React.FC<CardProps> = ({
  title,
  description,
  icon,
  onPress,
  selected = false,
  children,
  accentColor = "bg-blue-600", 
}) => {
  const Component = onPress ? TouchableOpacity : View;


  const containerBorder = selected ? 'border-blue-500' : 'border-slate-100';
  const containerBg = selected ? 'bg-blue-50/50' : 'bg-white';
  const barColor = selected ? accentColor : 'bg-slate-300';

  return (
    <Component
      className={`${containerBg} rounded-[24px] p-5 border-2 ${containerBorder} shadow-sm flex-row items-start mb-4`}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
 
      {icon && (
        <View className={`w-14 h-14 rounded-2xl items-center justify-center mr-4 bg-white border border-slate-100 shadow-sm`}>
          {/* Si el icono es texto/emoji, asegúrate de envolverlo en <Text> al pasarlo, o renderizarlo aquí */}
          {typeof icon === 'string' ? <Text className="text-2xl">{icon}</Text> : icon}
        </View>
      )}
      

      <View className="flex-1 py-1">
        <View className="flex-row justify-between items-start mb-1">
          <Text className="text-lg font-extrabold text-slate-900 flex-1 mr-2 leading-6">
            {title}
          </Text>
          
         
          {selected && (
            <View className="bg-blue-100 px-2 py-1 rounded-md">
                <View className={`w-2 h-2 rounded-full ${accentColor}`} />
            </View>
          )}
        </View>
        
        {description && (
          <Text className="text-sm text-slate-500 leading-5 mb-3 font-medium" numberOfLines={2}>
            {description}
          </Text>
        )}
        
    
        <View className="flex-row items-center mt-auto">
          <View className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <View className={`h-full w-1/3 rounded-full ${barColor}`} />
          </View>
        </View>

       
        {children && <View className="mt-3 pt-3 border-t border-slate-100">{children}</View>}
      </View>
    </Component>
  );
};