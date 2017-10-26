//
//  SyrButton.m
//  SyrNative
//
//  Created by Anderson,Derek on 10/20/17.
//  Copyright © 2017 Anderson,Derek. All rights reserved.
//

#import "SyrButton.h"
#import "SyrEventHandler.h"

@implementation SyrButton


SYR_EXPORT_MODULE();

SYR_EXPORT_METHOD(addEvent:(NSString *)name location:(NSString *)location)
{
  NSLog(@"some stuff");
}


+(NSObject*) render: (NSDictionary*) component {
  UIButton *button = [UIButton buttonWithType:UIButtonTypeSystem];
  NSDictionary* style = [[[component objectForKey:@"instance"] objectForKey:@"props"] valueForKey:@"style"];
  [button setTitle:@"Press Me" forState:UIControlStateNormal];
  button.frame = [SyrButton styleFrame:style];

  //[button sizeToFit];
  NSNumber* tag = [[component valueForKey:@"instance"] valueForKey:@"tag"];
  [button addTarget:[SyrEventHandler sharedInstance] action:@selector(btnSelected:) forControlEvents:UIControlEventTouchUpInside];
  button.tag = [tag integerValue];
  // Add an action in current code file (i.e. target)
  return button;
}

@end
